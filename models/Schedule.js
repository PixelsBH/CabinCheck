import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subjectName: { type: String, required: true },
  roomNo: { type: String, required: true },
  batchName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
