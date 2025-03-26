import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();

// Fetch all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("teacher");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
});

export default router;
