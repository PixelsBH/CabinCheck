import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationById,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Routes
router.get("/", getAllNotifications); // Fetch all notifications
router.post("/", createNotification); // Create a new notification
router.get("/:id", getNotificationById); // Fetch a notification by ID
router.delete("/:id", deleteNotification); // Delete a notification

export default router;
