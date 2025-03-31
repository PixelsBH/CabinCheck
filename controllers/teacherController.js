import Teacher from "../models/Teacher.js";

// Fetch all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("schedule");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error: error.message });
  }
};

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, status, office, image, firebaseUID, subjects } = req.body; // Added firebaseUID and subjects

    const newTeacher = new Teacher({ name, email, status, office, image, firebaseUID, subjects });
    await newTeacher.save();

    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: "Error creating teacher", error: error.message });
  }
};

// Fetch a single teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("schedule");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher", error: error.message });
  }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, status, office, image, firebaseUID, subjects } = req.body; // Added firebaseUID and subjects
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, email, status, office, image, firebaseUID, subjects },
      { new: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher", error: error.message });
  }
};

// Update teacher status
export const updateTeacherStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = !teacher.status; // Toggle the status
    await teacher.save();

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher status", error: error.message });
  }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher", error: error.message });
  }
};
