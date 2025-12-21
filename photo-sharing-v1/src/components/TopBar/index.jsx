import React from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import { useAdvancedFeatures } from "../../context/AdvancedFeaturesContext";
import { useAuth } from "../../context/AuthContext";
import fetchModel from "../../lib/fetchModelData";
import UploadPhotoDialog from "../UploadPhotoDialog";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { advancedFeatures, setAdvancedFeatures } = useAdvancedFeatures();
  const { currentUser, logout } = useAuth();
  const [user, setUser] = React.useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  // Fetch user data when params change
  React.useEffect(() => {
    if (params.userId) {
      // For Problem 2: Fetch from server
      fetchModel(`/user/${params.userId}`)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error("Error fetching user details:", error);
          // Fallback to local data
          setUser(models.userModel(params.userId));
        });
    }
  }, [params.userId]);

  // Get the context for the right side of the TopBar
  const getContextInfo = () => {
    const path = location.pathname;
    
    if (!user && params.userId) {
      return "";
    }
    
    if (path.includes("/users/") && user) {
      return `${user.first_name} ${user.last_name}`;
    } else if (path.includes("/photos/") && user) {
      return `Photos of ${user.first_name} ${user.last_name}`;
    }
    return "";
  };

  const handleAdvancedFeaturesChange = (event) => {
    setAdvancedFeatures(event.target.checked);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8081/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Photo Sharing App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentUser ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={advancedFeatures}
                    onChange={handleAdvancedFeaturesChange}
                    name="advancedFeatures"
                    color="default"
                  />
                }
                label="Enable Advanced Features"
                sx={{ color: 'white' }}
              />
              <Typography variant="h6" color="inherit">
                {getContextInfo()}
              </Typography>
              <Typography variant="body1" color="inherit">
                Hi {currentUser.first_name}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setUploadDialogOpen(true)}
                sx={{ ml: 1 }}
              >
                Add Photo
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="h6" color="inherit">
              Please Login
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    
    {/* Upload Photo Dialog */}
    <UploadPhotoDialog
      open={uploadDialogOpen}
      onClose={() => setUploadDialogOpen(false)}
    />
    </>
  );
}

export default TopBar;
