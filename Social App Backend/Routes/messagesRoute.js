const express = require("express");
const router = express.Router();
const Message = require("../Model/messageModel");

// POST /api/messages - add a chat message
router.post("/", async (req, res) => {
  try {
    const { gangId, userId, message } = req.body;
    if (!gangId || !userId || !message)
      return res
        .status(400)
        .json({ error: "gangId, userId and message required" });

    const msg = new Message({ gangId, userId, message });
    await msg.save();
    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/messages/:gangId - get messages for a gang
router.get("/:gangId", async (req, res) => {
  try {
    const { gangId } = req.params;
    const messages = await Message.find({ gangId })
      .sort({ createdAt: 1 })
      .populate("userId", "username profileImage");
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
