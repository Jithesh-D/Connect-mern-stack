const express = require("express");
const router = express.Router();
const GangPost = require("../Model/gangPostModel");

// POST /api/posts - create a new gang post
router.post("/", async (req, res) => {
  try {
    const { gangId, userId, text, imageUrl } = req.body;
    if (!gangId || !userId)
      return res.status(400).json({ error: "gangId and userId required" });

    const post = new GangPost({ gangId, userId, text, imageUrl });
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/posts/:gangId - get posts for a gang
router.get("/:gangId", async (req, res) => {
  try {
    const { gangId } = req.params;
    const posts = await GangPost.find({ gangId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profileImage");
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
