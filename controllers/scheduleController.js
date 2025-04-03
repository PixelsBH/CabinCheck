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

// Add a custom event
export const addCustomEvent = async (req, res) => {
  try {
    const { teacher, title, startTime, endTime, date, description } = req.body;

    // Find the schedule for the given teacher
    const schedule = await Schedule.findOne({ teacher });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found for the given teacher" });
    }

    if (!schedule.schedule.Custom) {
      schedule.schedule.Custom = []; // Ensure the Custom key exists
    }

    const customEvent = { title, startTime, endTime, date, description }; // Include description in the custom event object
    schedule.schedule.Custom.push(customEvent); // Add the custom event to the Custom key
    await schedule.save();

    res.status(200).json({ message: "Custom event added successfully", customEvent });
  } catch (error) {
    res.status(500).json({ message: "Error adding custom event", error: error.message });
  }
};

// Delete a custom event
export const deleteCustomEvent = async (req, res) => {
  try {
    const { teacher, title } = req.body; // Use title instead of eventId
    const schedule = await Schedule.findOne({ teacher });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found for the given teacher" });
    }

    const eventIndex = schedule.schedule.Custom.findIndex(event => event.title === title);
    if (eventIndex === -1) {
      return res.status(404).json({ message: "Custom event not found" });
    }

    schedule.schedule.Custom.splice(eventIndex, 1);
    await schedule.save();

    res.status(200).json({ message: "Custom event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting custom event", error: error.message });
  }
};
