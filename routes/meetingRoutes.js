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
router.get("/:id", getMeetingById); // Changed route to avoid conflict with `/:name`
router.put("/:id", updateMeeting); // Update a meeting
router.delete("/:teacher/:username", deleteMeeting); // Ensure this matches the frontend request

export default router;
