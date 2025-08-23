import express from "express";
import {
  createStudent,
  getStudentById,
  updateStudent,
  togglePinTeacher,
  getPinnedTeachers,
} from "../controllers/studentController.js";

const router = express.Router();

// Routes
//router.get("/", getAllStudents); // Fetch all students
router.post("/", createStudent); // Create a new student
router.get("/:id", getStudentById); // Fetch a student by ID
router.put("/:id", updateStudent); // Update a student
router.patch("/pin/:email", togglePinTeacher); //Toggle pin/unpin a teacher for a student
router.get("/:firebaseUID/pinned", getPinnedTeachers); //Get pinned teachers for a student

export default router;
