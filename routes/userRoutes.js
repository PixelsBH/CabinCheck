const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");  // Import Firebase Admin SDK
const User = require("../models/User");  // Import User model

// Register a new user (with Firebase authentication)
router.post("/register", async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    
    // Verify Firebase authentication token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { email, name, uid } = decodedToken;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, role: "student", firebaseUID: uid });
      await user.save();
    }

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
