import express from "express";
import {
  getAllMeetings,
  createMeeting,
  getMeetingsByTeacherEmail,
  deleteMeeting,
  patchMeetingStatus,
} from "../controllers/meetingController.js";

const router = express.Router();

// Routes
router.get("/student/:name", getAllMeetings); // Fetch all meetings by student name
router.post("/", createMeeting); // Create a new meeting
router.get("/teacher/:email", getMeetingsByTeacherEmail); // Fetch meetings by teacher email
router.delete("/:teacher/:username", deleteMeeting); // Delete meetings by teacher and student
router.patch("/:id/status", patchMeetingStatus); // Update meeting status (approve/reject)

export default router;
