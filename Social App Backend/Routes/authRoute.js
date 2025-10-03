const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.getCurrentUser); // Get current user profile
router.get("/check", authController.checkAuth); // Check authentication status

module.exports = router;
