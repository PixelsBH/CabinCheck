import express from "express";
import {
  getAllNotifications,
  createNotification,
  getNotificationByTeacher,
  deleteNotificationByTeacher,
} from "../controllers/notificationController.js";

const router = express.Router();

// Routes
router.get("/", getAllNotifications); // Fetch all notifications
router.post("/", createNotification); // Create a new notification
router.get("/:teacher", getNotificationByTeacher); // Fetch a notification by teacher's name
router.delete("/:teacher", deleteNotificationByTeacher); // Delete a notification by teacher's name

export default router;
