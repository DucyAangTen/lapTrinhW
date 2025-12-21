const express = require("express");
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../photo-sharing-v1/public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

/**
 * GET /photosOfUser/:id - Get all photos of user
 * Photos properties: _id, user_id, comments, file_name, date_time
 * Comments properties: comment, date_time, _id, user (_id, first_name, last_name)
 */
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ error: "Invalid user ID format" });
    }
    
    const photos = await Photo.find({ user_id: userId }).exec();
    
    if (!photos || photos.length === 0) {
      return response.status(200).json([]);
    }
    
    const photosWithUserInfo = await Promise.all(
      photos.map(async (photo) => {
        const photoObj = photo.toObject();
        
        // Xử lý comments - thêm thông tin user cho mỗi comment
        if (photoObj.comments && photoObj.comments.length > 0) {
          photoObj.comments = await Promise.all(
            photoObj.comments.map(async (comment) => {
              const commentUser = await User.findById(comment.user_id, {
                _id: 1,
                first_name: 1,
                last_name: 1
              }).exec();
              
              return {
                _id: comment._id,
                comment: comment.comment,
                date_time: comment.date_time,
                user: commentUser || { _id: comment.user_id, first_name: "Unknown", last_name: "User" }
              };
            })
          );
        }
        
        // Trả về photo với các thuộc tính cần thiết
        return {
          _id: photoObj._id,
          user_id: photoObj.user_id,
          file_name: photoObj.file_name,
          date_time: photoObj.date_time,
          comments: photoObj.comments || []
        };
      })
    );
    
    response.status(200).json(photosWithUserInfo);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(400).json({ error: "Error fetching photos for user" });
  }
});

/**
 * POST /commentsOfPhoto/:photo_id - Add comment to photo
 * Body: { comment: string }
 */
router.post("/CommentsOfPhoto/:photo_id", async (req, res) => {
  try {
    const photoId = req.params.photo_id;
    const { comment } = req.body;
    
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }
    
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "User not logged in" });
    }
    
    if (!photoId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid photo ID format" });
    }
    
    const photo = await Photo.findById(photoId).exec();
    
    if (!photo) {
      return res.status(400).json({ error: "Photo not found" });
    }
    
    const newComment = {
      comment: comment.trim(),
      user_id: req.session.user._id,
      date_time: new Date()
    };
    
    photo.comments.push(newComment);
    await photo.save();
    
    const user = await User.findById(req.session.user._id, {
      _id: 1,
      first_name: 1,
      last_name: 1
    }).exec();
    
    const savedComment = photo.comments[photo.comments.length - 1];
    res.status(200).json({
      _id: savedComment._id,
      comment: savedComment.comment,
      date_time: savedComment.date_time,
      user: user
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment" });
  }
});

/**
 * POST /photos/new - Upload new photo
 * Body: multipart/form-data with file field
 */
router.post("/new", upload.single('photo'), async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "User not logged in" });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const newPhoto = await Photo.create({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: req.session.user._id,
      comments: []
    });
    
    console.log("Photo uploaded:", req.file.filename, "by user", req.session.user._id);
    
    res.status(200).json({
      _id: newPhoto._id,
      file_name: newPhoto.file_name,
      date_time: newPhoto.date_time,
      user_id: newPhoto.user_id,
      comments: []
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ error: "Error uploading photo" });
  }
});

module.exports = router;

