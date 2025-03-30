import Meeting from "../models/Meeting.js";

// Fetch all meetings
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("teacher").populate("student");
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error: error.message });
  }
};

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { teacher, student, date, meetTime, status } = req.body;

    const newMeeting = new Meeting({ teacher, student, date, meetTime, status });
    await newMeeting.save();

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error: error.message });
  }
};

// Fetch a single meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate("teacher").populate("student");
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meeting", error: error.message });
  }
};

// Update a meeting
export const updateMeeting = async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ message: "Error updating meeting", error: error.message });
  }
};

// Delete a meeting
export const deleteMeeting = async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meeting", error: error.message });
  }
};
