import express from "express";
import {
  getAllSchedules,
  createSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

const router = express.Router();

// Routes
router.get("/", getAllSchedules); // Fetch all schedules
router.post("/", createSchedule); // Create a new schedule
router.get("/:id", getScheduleById); // Fetch a schedule by ID
router.put("/:id", updateSchedule); // Update a schedule
router.delete("/:id", deleteSchedule); // Delete a schedule

export default router;
