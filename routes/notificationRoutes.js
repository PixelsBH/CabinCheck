import express from "express";
import Notification from "../models/Notifications.js";

const router = express.Router();

// Fetch all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().populate("recipient");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

export default router;
