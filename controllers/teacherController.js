import Teacher from "../models/Teacher.js";

// Fetch all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error: error.message });
  }
};

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, image, firebaseUID } = req.body;

    // Check if a teacher with the same firebaseUID already exists
    let teacher = await Teacher.findOne({ firebaseUID });
    if (teacher) {
      return res.status(200).json(teacher); // Return existing teacher
    }

    // Check if a teacher with the same email exists (dummy entry)
    teacher = await Teacher.findOne({ email });
    if (teacher) {
      // Assign the firebaseUID to the existing teacher
      teacher.firebaseUID = firebaseUID;
      await teacher.save();
      return res.status(200).json(teacher); // Return updated teacher
    }

    // Create a new teacher if no matching entry is found
    const newTeacher = new Teacher({
      name,
      email,
      image,
      firebaseUID,
      status: false, // Default status to false
    });
    await newTeacher.save();

    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: "Error creating or logging in teacher", error: error.message });
  }
};

// Fetch a single teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
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
    const { name, email, status, office, image, firebaseUID, note } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, email, status, office, image, firebaseUID, note },
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
