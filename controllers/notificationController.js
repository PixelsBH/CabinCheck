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
    const { title, message, teacher, years, departments } = req.body; // Include teacher and targeting

    // Expect departments to be an array of strings. Validate and normalize to uppercase.
    if (!Array.isArray(departments)) {
      return res.status(400).json({ message: 'departments must be an array of strings' });
    }
    const deptArray = departments.map((d) => String(d).trim().toUpperCase()).filter(Boolean);
    if (deptArray.length === 0) deptArray.push('ALL');

    const newNotification = new Notification({ title, message, teacher, years, departments: deptArray });
    await newNotification.save();

    res.status(200).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
};

// Fetch a single notification by teacher's name
export const getNotificationByTeacher = async (req, res) => {
  try {
    const notifications = await Notification.find({ teacher: req.params.teacher });
    if (!notifications) {
      return res.status(201).json({ message: "No existing notification" });
    }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification", error: error.message });
  }
};

// Fetch notifications relevant for a student's roll number
export const getNotificationsForRoll = async (req, res) => {
  try {
    const { roll } = req.params;
    if (!roll || typeof roll !== 'string' || roll.length < 7) {
      return res.status(400).json({ message: 'Invalid roll number' });
    }

    // Assumptions (documented): roll format like 2023BCY0007 -> year first 4 chars, dept next 3 chars
    const year = roll.slice(0, 4);
    const dept = roll.slice(4, 7).toUpperCase();

    // Fetch notifications where (targetYears contains year OR contains 'all')
    // AND (departments contains dept OR contains 'ALL')
    // Query: years match or 'all', and departments array contains dept or contains 'ALL'
    const notifications = await Notification.find({
      $and: [
        { $or: [{ years: year }, { years: 'all' }] },
        { departments: { $in: [dept, 'ALL'] } },
      ],
    }).sort({ date: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications for roll', error: error.message });
  }
};

// Delete a notification by teacher's name
export const deleteNotificationByTeacher = async (req, res) => {
  try {
  // Use _id for deletion. The route should pass the notification id as the param `id`.
  const deletedNotification = await Notification.findOneAndDelete({ _id: req.params.id });
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
}
