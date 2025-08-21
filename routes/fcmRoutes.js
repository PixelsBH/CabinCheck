import express from "express";
import admin from "../config/firebaseAdmin.js";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// Send push notification
router.post("/send", async (req, res) => {
  const { firebaseUID, token } = req.body;

  if (!firebaseUID || !token) return res.status(400).json({ error: "Missing firebaseUID or token" });

  try {
    const teacher = await Teacher.findOneAndUpdate(
      { firebaseUID },
      { fcmToken: token },
      { new: true }
    );

    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
