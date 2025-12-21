const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

/**
 * GET /user/list - Trả về danh sách user cho navigation sidebar
 * Chỉ trả về _id, first_name, last_name
 */
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, { _id: 1, first_name: 1, last_name: 1 }).exec();
    response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /user/:id - Trả về thông tin chi tiết của user
 * Trả về _id, first_name, last_name, location, description, occupation
 */
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    // Kiểm tra xem userId có hợp lệ không
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ error: "Invalid user ID format" });
    }
    
    const user = await User.findById(userId, {
      _id: 1,
      first_name: 1,
      last_name: 1,
      location: 1,
      description: 1,
      occupation: 1
    }).exec();
    
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }
    
    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    response.status(400).json({ error: "Invalid user ID" });
  }
});

/**
 * POST /user - Register new user
 * Body: { login_name, password, first_name, last_name, location, description, occupation }
 */
router.post("/", async (req, res) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
    
    // Validate required fields
    if (!login_name || login_name.trim() === "") {
      return res.status(400).json({ error: "Login name is required" });
    }
    
    if (!password || password.trim() === "") {
      return res.status(400).json({ error: "Password is required" });
    }
    
    if (!first_name || first_name.trim() === "") {
      return res.status(400).json({ error: "First name is required" });
    }
    
    if (!last_name || last_name.trim() === "") {
      return res.status(400).json({ error: "Last name is required" });
    }
    
    const existingUser = await User.findOne({ login_name: login_name.trim() }).exec();
    if (existingUser) {
      return res.status(400).json({ error: "Login name already exists" });
    }
    
    const newUser = await User.create({
      login_name: login_name.trim(),
      password: password,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location ? location.trim() : "",
      description: description ? description.trim() : "",
      occupation: occupation ? occupation.trim() : ""
    });
    
    console.log("New user registered:", newUser.login_name);
    
    res.status(200).json({
      login_name: newUser.login_name,
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

module.exports = router;
