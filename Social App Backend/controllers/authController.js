const bcrypt = require("bcryptjs");
const User = require("../Model/userModel");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "731499129152-te7fngasjpd55l5hd550l5o8sgkl40vv.apps.googleusercontent.com";
const ALLOWED_DOMAIN = "@rvu.edu.in";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

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

// Google OAuth credential verification and login/signup
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ error: "No credential provided" });

    // Verify ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || payload?.given_name || "";

    if (!email || !email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      return res
        .status(403)
        .json({ error: `Only ${ALLOWED_DOMAIN} accounts are allowed.` });
    }

    // Create or merge user record
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create a new user. We generate a random password hash so local login won't work unless set.
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      await user.save();
    } else {
      // Optionally update username if missing
      if (!user.username && name) {
        user.username = name;
        await user.save();
      }
    }

    // Create server-side session
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
    console.error("Google auth error:", err);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
