import express from "express";
import {
  getAllMeetings,
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

// Routes
router.get("/:name", getAllMeetings); // Fetch all meetings
router.post("/", createMeeting); // Create a new meeting (fixed route)
router.get("/:id", getMeetingById); // Fetch a single meeting by ID
router.put("/:id", updateMeeting); // Update a meeting
router.delete("/:teacher/:username", deleteMeeting); // Delete meetings by teacher and student

export default router;
