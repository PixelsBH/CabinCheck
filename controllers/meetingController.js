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
  try {
    const { teacher, student, purpose } = req.body;

    // Log the incoming request body
    console.log("Request Body:", req.body);

    // Create a new meeting
    const newMeeting = new Meeting({ teacher, student, purpose});
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

// Fetch meetings by teacher email
export const getMeetingsByTeacherEmail = async (req, res) => {
  try {
    const { email } = req.params; // Extract the teacher's email from the route parameter
    const meetings = await Meeting.find({ teacher: email }); // Fetch meetings by teacher email
    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ message: "No meetings found for the given teacher email" });
    }
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings by teacher email:", error);
    res.status(500).json({ message: "Error fetching meetings", error: error.message });
  }
};

// Delete a meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { teacher, username } = req.params; // Extract teacher and student from route parameters

    // Log the parameters for debugging
    console.log("Delete Request Received - Teacher:", teacher, "Student:", username);

    // Find and delete all meetings where teacher and student match
    const deletedMeetings = await Meeting.deleteMany({ teacher, student: username });

    // Log the result of the delete operation
    console.log("Deleted Meetings Count:", deletedMeetings.deletedCount);

    if (deletedMeetings.deletedCount === 0) {
      return res.status(404).json({ message: "No meetings found to delete" });
    }

    res.status(200).json({ message: "Meetings deleted successfully", deletedCount: deletedMeetings.deletedCount });
  } catch (error) {
    console.error("Error deleting meetings:", error);
    res.status(500).json({ message: "Error deleting meetings", error: error.message });
  }
};

// Update meeting status (approve or reject)
export const patchMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract meeting ID from route parameters
    const { status } = req.body; // Extract status from request body

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Allowed values are 'Approved' or 'Rejected'." });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: `Meeting ${status.toLowerCase()} successfully`, updatedMeeting });
  } catch (error) {
    console.error("Error updating meeting status:", error);
    res.status(500).json({ message: "Error updating meeting status", error: error.message });
  }
};
