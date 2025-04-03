import Notification from "../models/Notifications.js";

// Fetch all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, teacher } = req.body; // Include teacher in request body

    const newNotification = new Notification({ title, message, teacher }); // Add teacher field
    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
};

// Fetch a single notification by teacher's name
export const getNotificationByTeacher = async (req, res) => {
  try {
    const notification = await Notification.findOne({ teacher: req.params.teacher });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification", error: error.message });
  }
};

// Delete a notification by teacher's name
export const deleteNotificationByTeacher = async (req, res) => {
  try {
    const deletedNotification = await Notification.findOneAndDelete({ teacher: req.params.teacher });
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
}
