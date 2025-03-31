import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, // Ensure this matches the `teacher` field in the query
  student: { type: String, required: true }, // Ensure this matches the `student` field in the query
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
