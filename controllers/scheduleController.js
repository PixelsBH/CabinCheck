import Schedule from "../models/Schedule.js";

// Fetch all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("teacher");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const { teacher, subjectName, roomNo, batchName, startTime, endTime } = req.body;

    const newSchedule = new Schedule({ teacher, subjectName, roomNo, batchName, startTime, endTime });
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating schedule", error: error.message });
  }
};

// Fetch a single schedule by ID
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate("teacher");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error: error.message });
  }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error updating schedule", error: error.message });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting schedule", error: error.message });
  }
};
