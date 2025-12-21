const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRouter = require("./routes/AdminRouter");
const { requireAuth, requireAuthExceptPost } = require("./middleware/auth");

// Kết nối database
dbConnect();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: "photo-sharing-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use("/admin", AdminRouter);
app.use("/user", requireAuthExceptPost, UserRouter);
app.use("/photosOfUser", requireAuth, PhotoRouter);
app.use("/photos", requireAuth, PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Photo Sharing App Backend API - Lab 3" });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

