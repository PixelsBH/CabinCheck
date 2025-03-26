import express from "express";
import Meeting from "../models/Meeting.js";

const router = express.Router();

// Fetch all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("teacher").populate("student");
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error: error.message });
  }
});

export default router;
