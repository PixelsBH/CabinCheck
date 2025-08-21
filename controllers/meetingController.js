import Meeting from "../models/Meeting.js";
import Teacher from "../models/Teacher.js";
import admin from "../config/firebaseAdmin.js";
import { send } from "vite";
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
const sendNotification = async (teacher, rollNo, purpose) => {
  let notificationSent = false;
try {
  const teacherDoc = await Teacher.findOne({ email: teacher });
  if (teacherDoc && teacherDoc.fcmToken) {
    const message = {
      notification: {
        title: "New Meeting Request",
        body: `${rollNo} has requested a meeting. Purpose: ${purpose}`
      },
      token: teacherDoc.fcmToken,
    };
    await admin.messaging().send(message);
    notificationSent = true;
  } else {
    console.log("Teacher not found or no FCM token:", teacher);
  }
} catch (err) {
  console.error("Error sending FCM notification:", err);
}
}
export const createMeeting = async (req, res) => {
  try {
    const { teacher, student, rollNo, purpose } = req.body;

    const existingMeeting = await Meeting.findOne({ teacher, student });

    if (existingMeeting) {
      return res.status(400).json({
        message: "You already have a meeting request with this teacher."
      });
    }
    // Create a new meeting
    const newMeeting = new Meeting({ teacher, student, rollNo, purpose});
    await newMeeting.save();
    sendNotification(teacher, rollNo, purpose); // Send notification after saving the meeting
    console.log("Meeting created successfully:", newMeeting);
    res.status(200).json(newMeeting);
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

    // Find and delete all meetings where teacher and student match
    const deletedMeetings = await Meeting.deleteMany({ teacher, student: username });

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
    const { status, timeAllotted } = req.body; // Extract status adn timeAllotted from request body

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Allowed values are 'Approved' or 'Rejected'." });
    }

     // Prepare update object
    const updateFields = { status };

    if (status === "Approved" && timeAllotted) {
      updateFields.timeAllotted = timeAllotted;
    }

    if (status === "Rejected") {
      updateFields.timeAllotted = "Not Allotted";
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: `Meeting set to ${status.toLowerCase()} successfully`, updatedMeeting });
  } catch (error) {
    console.error("Error updating meeting status:", error);
    res.status(500).json({ message: "Error updating meeting status", error: error.message });
  }
};
