import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, // Changed to String
  subjectName: { type: String, required: true },
  roomNo: { type: String, required: true },
  batchName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
