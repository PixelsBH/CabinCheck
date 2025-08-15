import express from "express";
import {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// Routes
//router.get("/", getAllStudents); // Fetch all students
router.post("/", createStudent); // Create a new student
router.get("/:id", getStudentById); // Fetch a student by ID
router.put("/:id", updateStudent); // Update a student
router.delete("/:id", deleteStudent); // Delete a student

export default router;
