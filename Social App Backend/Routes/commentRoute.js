const express = require("express");
const router = express.Router();
const Comment = require("../Model/commentModel");
const Post = require("../Model/postModel");
const authMiddleware = require("../Middleware/auth");

// GET all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      console.log("Post not found:", req.params.postId);
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: req.params.postId })
      .populate("author", "username name")
      .sort({ timestamp: -1 });

    console.log(
      `Found ${comments.length} comments for post ${req.params.postId}`
    );
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment to a post
// POST a new comment to a post
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get user ID - ensure we're storing the ID consistently
    let userId = req.user.id || req.user._id || req.user.userId;
    let userName = req.user.name || req.user.username || "User";

    const comment = new Comment({
      postId: req.params.postId,
      text: text.trim(),
      author: userId, // This should be stored as ObjectId
      authorName: userName,
    });

    const savedComment = await comment.save();
    await savedComment.populate("author", "username name");

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE a comment by ID
// DELETE a comment by ID
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Get current user ID - try all possible property names
    const currentUserId = req.user.id || req.user._id || req.user.userId;

    // Convert both to string for comparison - THIS IS THE FIX
    const currentUserIdStr = currentUserId ? currentUserId.toString() : null;
    const commentAuthorIdStr = comment.author
      ? comment.author.toString()
      : null;

    if (!currentUserIdStr || currentUserIdStr !== commentAuthorIdStr) {
      console.log("User not authorized to delete this comment");
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
