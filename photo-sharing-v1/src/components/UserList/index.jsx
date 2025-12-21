import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // For Problem 1: Use the model data directly
    // setUsers(models.userListModel());
    
    // For Problem 2: Fetch data from server
    fetchModel("/user/list")
      .then(users => {
        setUsers(users);
      })
      .catch(error => {
        console.error("Error fetching user list:", error);
        // Fallback to local data if server fetch fails
        setUsers(models.userListModel());
      });
  }, []);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Users
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem 
              button 
              component={Link} 
              to={`/users/${user._id}`}
            >
              <ListItemText 
                primary={`${user.first_name} ${user.last_name}`} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
