const express = require("express");
const router = express.Router();
const Gang = require("../Model/gangModel");
const User = require("../Model/userModel");

// POST /api/gangs/create
router.post("/create", async (req, res) => {
  try {
    const { gangId, gangName, description, userId } = req.body;
    if (!gangId || !gangName || !userId) {
      return res
        .status(400)
        .json({ error: "gangId, gangName and userId required" });
    }

    const existing = await Gang.findOne({ gangId });
    if (existing)
      return res.status(409).json({ error: "Gang ID already exists" });

    const gang = new Gang({ gangId, gangName, description, members: [userId] });
    await gang.save();
    res.json({ success: true, gang });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/gangs/:gangId
router.get("/:gangId", async (req, res) => {
  try {
    const { gangId } = req.params;
    const gang = await Gang.findOne({ gangId }).populate(
      "members",
      "username email profileImage"
    );
    if (!gang) return res.status(404).json({ error: "Gang not found" });
    res.json({ gang });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/gangs/join
router.post("/join", async (req, res) => {
  try {
    const { gangId, userId } = req.body;
    if (!gangId || !userId)
      return res.status(400).json({ error: "gangId and userId required" });

    const gang = await Gang.findOne({ gangId });
    if (!gang) return res.status(404).json({ error: "Gang not found" });

    // Add if not already a member
    const already = gang.members.some((m) => m.toString() === userId);
    if (!already) {
      gang.members.push(userId);
      await gang.save();
    }

    res.json({ success: true, gang });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
