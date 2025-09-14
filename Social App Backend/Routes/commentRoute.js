const express = require("express");
const Comment = require("../Model/commentModel");
const { checkToxicity } = require("../utils/toxicityChecker");

const router = express.Router();

// POST /comments/add - Add a new comment
router.post("/add", async (req, res) => {
  const { userId, comment } = req.body;

  try {
    // Validation for empty comments
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    // Validation for comment length
    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be longer than 500 characters",
      });
    }

    // Check toxicity
    const toxicityScore = await checkToxicity(comment);

    if (toxicityScore > 0.7) {
      return res.status(400).json({
        success: false,
        message: "❌ Your comment was flagged as toxic. Please rephrase.",
        toxicityScore,
      });
    }

    // Save comment in DB
    const newComment = await Comment.create({
      userId,
      comment,
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "✅ Comment posted successfully!",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET /comments/all - Get all comments
router.get("/all", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // Sort by createdAt descending

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
});

module.exports = router;
