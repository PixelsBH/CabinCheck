import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  batch: { type: String, required: true },
  roomNo: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});
const CustomEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: { type: String, required: true }, 
  description: { type: String },
});
const ScheduleSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, 
  schedule: {
    Monday: [ClassSchema],
    Tuesday: [ClassSchema],
    Wednesday: [ClassSchema],
    Thursday: [ClassSchema],
    Friday: [ClassSchema],
    Custom: [CustomEventSchema],
  },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
