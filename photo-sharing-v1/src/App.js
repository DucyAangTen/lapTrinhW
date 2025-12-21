import './App.css';

import React from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { AdvancedFeaturesProvider } from "./context/AdvancedFeaturesContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const App = (props) => {
  return (
    <AuthProvider>
      <AdvancedFeaturesProvider>
        <Router>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar />
              </Grid>
              <div className="main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <ProtectedRoute>
                    <UserList />
                  </ProtectedRoute>
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/login" element={<LoginRegister />} />
                    <Route
                        path="/users/:userId"
                        element = {
                          <ProtectedRoute>
                            <UserDetail />
                          </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/photos/:userId"
                        element = {
                          <ProtectedRoute>
                            <UserPhotos />
                          </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/photos/:userId/:photoIndex"
                        element = {
                          <ProtectedRoute>
                            <UserPhotos />
                          </ProtectedRoute>
                        }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute>
                          <UserList />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Router>
      </AdvancedFeaturesProvider>
    </AuthProvider>
  );
}

export default App;
