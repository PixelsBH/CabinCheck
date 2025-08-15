import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationByTeacher,
  getNotificationsForRoll,
  deleteNotificationByTeacher,
} from "../controllers/notificationController.js";

const router = express.Router();

// Routes
router.get("/", getAllNotifications); // Fetch all notifications
router.post("/", createNotification); // Create a new notification
router.get("/roll/:roll", getNotificationsForRoll); // Fetch notifications for a student's roll
router.get("/:teacher", getNotificationByTeacher); // Fetch a notification by teacher's name
router.delete("/:id", deleteNotificationByTeacher); // Delete a notification by teacher's name

export default router;
