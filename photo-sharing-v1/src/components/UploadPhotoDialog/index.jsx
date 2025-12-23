import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress
} from "@mui/material";

function UploadPhotoDialog({ open, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch("/photos/new", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to upload photo");
        setUploading(false);
        return;
      }

      console.log("Photo uploaded successfully:", data);
      
      setUploading(false);
      setSuccess(true);
      
      setSelectedFile(null);
      setPreview(null);

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error. Please try again.");
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreview(null);
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload New Photo</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Photo uploaded successfully! Close this dialog and go to "View Photos" to see your new photo.
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload-input"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="photo-upload-input">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              disabled={uploading}
            >
              Choose Photo
            </Button>
          </label>

          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}

          {preview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Uploading...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!selectedFile || uploading}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadPhotoDialog;
