const bcrypt = require("bcryptjs");
const User = require("../Model/userModel");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Set session after signup
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.session.user && req.session.user.id) {
      const user = await User.findById(req.session.user.id).select("-password");

      if (user) {
        res.json({
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
          },
        });
      } else {
        // User not found in database
        req.session.destroy();
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Check authentication status
exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ message: "Logout successful" });
  });
};
