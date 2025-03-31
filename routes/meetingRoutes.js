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
router.post("/", createMeeting); // Create a new meeting
router.get("/:id", getMeetingById); // Fetch a meeting by ID
router.put("/:id", updateMeeting); // Update a meeting
router.delete("/:id", deleteMeeting); // Delete a meeting

export default router;
