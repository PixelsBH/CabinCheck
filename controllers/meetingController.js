import Meeting from "../models/Meeting.js";

// Fetch all meetings
export const getAllMeetings = async (req, res) => {
  try {
    const { name } = req.params; // Extract the student's name from the route parameter

    // Fetch meetings where the student matches the provided name
    const meetings = await Meeting.find({ student: name }); // Removed .populate()

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Error fetching meetings", error: error.message });
  }
};

// Create a new meeting
export const createMeeting = async (req, res) => {
  console.log("inside createMeeting"); // Log to check if the function is called  
  try {
    const { teacher, student, date, status, meetTime } = req.body; // Include meetTime

    // Log the incoming request body
    console.log("Request Body:", req.body);

    // Validate meetTime is within allowed range
    const allowedTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
    if (!allowedTimes.includes(meetTime)) {
      console.error("Invalid meeting time:", meetTime);
      return res.status(400).json({ message: "Invalid meeting time selected" });
    }

    // Create a new meeting
    const newMeeting = new Meeting({ teacher, student, date, status, meetTime });
    await newMeeting.save();

    // Log the saved meeting
    console.log("New Meeting Created:", newMeeting);

    res.status(201).json(newMeeting);
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating meeting:", error);

    res.status(500).json({ message: "Error creating meeting", error: error.message });
  }
};

// Fetch a single meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id); // Removed .populate()
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
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
    const { teacher, username } = req.params; // Extract teacher and student from route parameters

    // Log the parameters for debugging
    console.log("Backend - Delete Request Received - Teacher:", teacher, "Student:", username);

    // Find and delete all meetings where teacher and student match
    const deletedMeetings = await Meeting.deleteMany({ teacher, student: username });

    // Log the result of the delete operation
    console.log("Backend - Deleted Meetings Count:", deletedMeetings.deletedCount);

    if (deletedMeetings.deletedCount === 0) {
      return res.status(404).json({ message: "No meetings found to delete" });
    }

    res.status(200).json({ message: "Meetings deleted successfully", deletedCount: deletedMeetings.deletedCount });
  } catch (error) {
    console.error("Error deleting meetings:", error);
    res.status(500).json({ message: "Error deleting meetings", error: error.message });
  }
};
