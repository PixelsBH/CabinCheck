import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

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
    const { firebaseUID }  = req.params;
    if (!firebaseUID) {
      return res.status(404).json({ message: "Invalid firebaseUID" });
    }
    const teacher = await Teacher.findOne({ firebaseUID: firebaseUID });
    if (!teacher) {
      return res.status(405).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher", error: error.message });
  }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
  try {
    if (!firebaseUID) {
      return res.status(404).json({ message: "Invalid firebaseUID" });
    }
    const { name, email, status, office, image, firebaseUID, note } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      { firebaseUID },
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

export const updateFcmToken = async (req, res) => {
  try {
    const { firebaseUID } = req.params;

    if (!firebaseUID) {
      return res.status(400).json({ message: "firebaseUID are required" });
    }

    const fcmToken = req.body.fcmToken;
    const teacher = await Teacher.findOneAndUpdate(
      { firebaseUID },
      { fcmToken },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error updating fcmToken", error: error.message });
  }
};

export const searchTeachers = async (req, res) => {
  try {
    const { query } = req.query;
    const studentId = req.userId; // assume middleware set this

    // Search by name or email
    const teachers = await Teacher.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name email status note office image"); // ✅ status included

    // Save recent search for student
    if (studentId && teachers.length > 0) {
      const student = await Student.findById(studentId);
      if (student) {
        const foundId = teachers[0]._id;

        student.recentSearches = [
          foundId,
          ...student.recentSearches.filter(
            (id) => id.toString() !== foundId.toString()
          ),
        ].slice(0, 5);

        await student.save();
      }
    }

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};