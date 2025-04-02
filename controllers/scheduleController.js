import Schedule from "../models/Schedule.js";

// Fetch all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const { teacher, schedule } = req.body;

    const newSchedule = new Schedule({ teacher, schedule });
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating schedule", error: error.message });
  }
};

// Fetch a single schedule by teacher email
export const getScheduleById = async (req, res) => {
  try {
    const { email } = req.params; // Extract teacher email from request parameters
    const schedule = await Schedule.findOne({ teacher: email }, { schedule: 1, _id: 0 }); // Fetch only the schedule field
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found for the given teacher email" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error: error.message });
  }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
  try {
    const { teacher, schedule } = req.body;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { teacher, schedule },
      { new: true }
    );
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
