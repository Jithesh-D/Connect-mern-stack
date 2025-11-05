const jwt = require("jsonwebtoken");

// Hardcoded allowed users for event creation
const allowedUsers = [
  { email: "RvuEventsAdmin@gmail.com", password: "RvuEvents@2025" },
];

exports.loginEventCreator = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user is in allowed list
    const allowedUser = allowedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!allowedUser) {
      return res
        .status(401)
        .json({ error: "Invalid credentials or unauthorized access" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: allowedUser.email, role: "event_creator" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: { email: allowedUser.email },
    });
  } catch (error) {
    console.error("Event login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
