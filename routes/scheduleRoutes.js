import express from "express";
import {
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  addCustomEvent,
  deleteCustomEvent,
} from "../controllers/scheduleController.js";

const router = express.Router();

// Routes
router.get("/", getAllSchedules); // Fetch all schedules
router.post("/", addCustomEvent); // Add a custom event
router.get("/:email", getScheduleById); // Fetch a schedule by teacher email
router.put("/:id", updateSchedule); // Update a schedule
router.delete("/:id", deleteCustomEvent); // Delete a custom event

export default router;
