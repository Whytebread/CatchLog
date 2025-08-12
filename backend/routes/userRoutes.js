const express = require("express");
const router = express.Router();
const { signupUser, loginUser, getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Private route
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
