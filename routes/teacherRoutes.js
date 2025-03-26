import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// Fetch all teachers with their schedules
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("schedule");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error: error.message });
  }
});

export default router;
