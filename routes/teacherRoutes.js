import express from "express";
import {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  updateTeacherStatus,
  updateFcmToken,
} from "../controllers/teacherController.js";

const router = express.Router();

// Routes
router.get("/", getAllTeachers); // Fetch all teachers
router.post("/", createTeacher); // Create a new teacher
router.get("/:firebaseUID", getTeacherById); // Fetch a teacher by ID
router.put("/:firebaseUID", updateTeacher); // Update a teacher
router.patch("/:id/status", updateTeacherStatus); // Update teacher status
router.patch("/:firebaseUID/fcm", updateFcmToken); // Update only the fcmToken

export default router;
