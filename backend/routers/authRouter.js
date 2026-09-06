const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Profile
router.get("/profile", auth, authController.profile);

module.exports = router;