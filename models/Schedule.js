const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },  // e.g., "Data Structures", "Research Meeting"
  type: { type: String, enum: ["Class", "Meeting", "Office Hours", "Custom"], required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "10:00 AM"
  endTime: { type: String, required: true },   // "11:30 AM"
  location: { type: String, default: "" },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
