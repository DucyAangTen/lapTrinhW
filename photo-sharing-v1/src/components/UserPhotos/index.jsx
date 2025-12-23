import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  List, 
  Box,
  Paper,
  Button,
  TextField
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdvancedFeatures } from "../../context/AdvancedFeaturesContext";

import "./styles.css";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Format date to a user-friendly string
 */
const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId, photoIndex } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(photoIndex ? parseInt(photoIndex, 10) : 0);
  const navigate = useNavigate();
  const { advancedFeatures } = useAdvancedFeatures();
  
  // State cho add comment
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    // For Problem 1: Use the model data directly
    // setPhotos(models.photoOfUserModel(userId));
    // setUser(models.userModel(userId));
    
    // For Problem 2: Fetch data from server
    fetchModel(`/photosOfUser/${userId}`)
      .then(photoData => {
        setPhotos(photoData);
      })
      .catch(error => {
        console.error("Error fetching user photos:", error);
        // Fallback to local data if server fetch fails
        setPhotos(models.photoOfUserModel(userId));
      });
    
    fetchModel(`/user/${userId}`)
      .then(userData => {
        setUser(userData);
      })
      .catch(error => {
        console.error("Error fetching user details:", error);
        // Fallback to local data if server fetch fails
        setUser(models.userModel(userId));
      });
  }, [userId]);

  // Advanced features are already imported from context


  // Update URL when navigating between photos in advanced mode
  useEffect(() => {
    if (advancedFeatures && photos.length > 0) {
      navigate(`/photos/${userId}/${currentPhotoIndex}`, { replace: true });
    }
  }, [advancedFeatures, currentPhotoIndex, userId, photos.length, navigate]);

  if (!photos.length || !user) {
    return <Typography variant="body1">Loading photos...</Typography>;
  }

  const handleNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleAddComment = async (photoId) => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      const response = await fetch(`/photosOfUser/CommentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCommentError(data.error || "Failed to add comment");
        setCommentLoading(false);
        return;
      }

      // Cập nhật photos state với comment mới
      setPhotos(photos.map(photo => {
        if (photo._id === photoId) {
          return {
            ...photo,
            comments: [...(photo.comments || []), data]
          };
        }
        return photo;
      }));

      // Reset form
      setNewComment("");
      setCommentLoading(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentError("Network error. Please try again.");
      setCommentLoading(false);
    }
  };

  // Advanced features: Single photo with stepper
  if (advancedFeatures) {
    const photo = photos[currentPhotoIndex];
    return (
      <div className="user-photos">
        <Typography variant="h4" gutterBottom>
          Photos of {user.first_name} {user.last_name}
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={`Photo by ${user.first_name} ${user.last_name}`}
            sx={{ maxHeight: 500, objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Posted on {formatDate(photo.date_time)}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
              <Button 
                variant="contained" 
                onClick={handlePrevious}
                disabled={currentPhotoIndex === 0}
              >
                &lt;&lt; Previous
              </Button>
              <Typography variant="body1">
                Photo {currentPhotoIndex + 1} of {photos.length}
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={currentPhotoIndex === photos.length - 1}
              >
                Next &gt;&gt;
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Comments</Typography>
            
            {photo.comments && photo.comments.length > 0 ? (
              <List>
                {photo.comments.map((comment) => (
                  <Paper key={comment._id} elevation={1} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No comments yet.</Typography>
            )}
            
            {/* Add Comment Form */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Add a Comment</Typography>
              {commentError && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {commentError}
                </Typography>
              )}
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={commentLoading}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(photo._id)}
                disabled={commentLoading || !newComment.trim()}
              >
                {commentLoading ? "Adding..." : "Add Comment"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Standard view: All photos
  return (
    <div className="user-photos">
      <Typography variant="h4" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>
      
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={`Photo by ${user.first_name} ${user.last_name}`}
            sx={{ maxHeight: 500, objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Posted on {formatDate(photo.date_time)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Comments</Typography>
            
            {photo.comments && photo.comments.length > 0 ? (
              <List>
                {photo.comments.map((comment) => (
                  <Paper key={comment._id} elevation={1} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="subtitle1">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No comments yet.</Typography>
            )}
            
            {/* Add Comment Form */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Add a Comment</Typography>
              {commentError && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {commentError}
                </Typography>
              )}
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={commentLoading}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(photo._id)}
                disabled={commentLoading || !newComment.trim()}
              >
                {commentLoading ? "Adding..." : "Add Comment"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
