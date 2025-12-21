const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

/**
 * POST /admin/login - User login
 * Body: { login_name: string, password: string }
 */
router.post("/login", async (req, res) => {
  try {
    const { login_name, password } = req.body;
    
    if (!login_name) {
      return res.status(400).json({ error: "Login name is required" });
    }
    
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    
    const user = await User.findOne({ login_name: login_name }).exec();
    
    if (!user) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }
    
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }
    
    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name
    };
    
    res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /admin/logout - User logout
 */
router.post("/logout", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(400).json({ error: "No user is currently logged in" });
  }
  
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
