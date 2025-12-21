import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button, Box } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // For Problem 1: Use the model data directly
    // setUser(models.userModel(userId));
    
    // For Problem 2: Fetch data from server
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

  if (!user) {
    return <Typography variant="body1">Loading user details...</Typography>;
  }

  return (
    <div className="user-detail">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          
          <Typography variant="h6" color="textSecondary">
            {user.occupation}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Location:</strong> {user.location}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {user.description}
          </Typography>
          
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to={`/photos/${user._id}`}
            >
              View Photos
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDetail;
