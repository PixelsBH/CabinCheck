import express from "express";
import {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

// Routes
router.get("/", getAllTeachers); // Fetch all teachers
router.post("/", createTeacher); // Create a new teacher
router.get("/:id", getTeacherById); // Fetch a teacher by ID
router.put("/:id", updateTeacher); // Update a teacher
router.delete("/:id", deleteTeacher); // Delete a teacher

export default router;
