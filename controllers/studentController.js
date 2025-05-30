import Student from "../models/Student.js";
import { extractRollNo } from "../utils/rollNoUtils.js";

// Fetch all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, email, firebaseUID, rollNo: providedRollNo } = req.body;

    // Compute roll number if not provided
    const rollNo = providedRollNo || extractRollNo(email);
    if (rollNo === "Invalid Email") {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the student already exists
    let existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      // Return the existing student
      return res.status(200).json(existingStudent);
    }

    // Create a new student
    const newStudent = new Student({ name, email, firebaseUID, rollNo });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Error creating student", error: error.message });
  }
};

// Fetch a single student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};
