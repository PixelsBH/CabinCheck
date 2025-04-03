import express from "express";
import {
  getAllMeetings,
  createMeeting,
  getMeetingsByTeacherEmail,
  updateMeeting,
  deleteMeeting,
  patchMeetingStatus,
} from "../controllers/meetingController.js";

const router = express.Router();

// Routes
router.get("/:name", getAllMeetings); // Fetch all meetings
router.post("/", createMeeting); // Create a new meeting
router.get("/:email", getMeetingsByTeacherEmail); // Fetch meetings by teacher email
router.put("/:id", updateMeeting); // Update a meeting
router.delete("/:teacher/:username", deleteMeeting); // Delete meetings by teacher and student
router.patch("/:id/status", patchMeetingStatus); // Update meeting status (approve/reject)

export default router;
