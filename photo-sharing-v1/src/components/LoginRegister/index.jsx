import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./styles.css";

function LoginRegister() {
  // Login state
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register state
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          login_name: loginName,
          password: loginPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Lưu thông tin user vào context
      login(data);
      
      // Chuyển đến trang user detail
      navigate(`/users/${data._id}`);
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (regPassword !== regPasswordConfirm) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: regLoginName,
          password: regPassword,
          first_name: regFirstName,
          last_name: regLastName,
          location: regLocation,
          description: regDescription,
          occupation: regOccupation
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Registration successful
      setSuccess("Registration successful! You can now login.");
      
      // Clear form
      setRegLoginName("");
      setRegPassword("");
      setRegPasswordConfirm("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");
      setLoading(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', bgcolor: '#f5f5f5', p: 2, pt: 8 }}>
      <Grid container spacing={2} maxWidth="md" sx={{ margin: '0 auto' }}>
        {/* Login Form */}
          <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 500, color: 'primary.main' }}>
                Login
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 1.5, py: 0.5 }}>{success}</Alert>}

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Login Name"
                  size="small"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  margin="dense"
                  required
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  size="small"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  margin="dense"
                  required
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1.5 }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Registration Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 500, color: 'secondary.main' }}>
                Register
              </Typography>

              <form onSubmit={handleRegister}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Login Name" size="small" value={regLoginName} onChange={(e) => setRegLoginName(e.target.value)} required disabled={loading} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Password" type="password" size="small" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required disabled={loading} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Confirm" type="password" size="small" value={regPasswordConfirm} onChange={(e) => setRegPasswordConfirm(e.target.value)} required disabled={loading} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="First Name" size="small" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required disabled={loading} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Last Name" size="small" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required disabled={loading} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Location" size="small" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} disabled={loading} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Description" size="small" multiline rows={2} value={regDescription} onChange={(e) => setRegDescription(e.target.value)} disabled={loading} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Occupation" size="small" value={regOccupation} onChange={(e) => setRegOccupation(e.target.value)} disabled={loading} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" color="secondary" disabled={loading}>
                      {loading ? "Registering..." : "Register Me"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginRegister;
