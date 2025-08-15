import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, // Teacher's name or ID
  student: { type: String, required: true }, // Student's name or ID
  rollNo: { type: String, required: true }, // Student's roll number
  purpose: { type: String, required: true }, // Purpose of the meeting
  timeAllotted: { type: String, required: true, default: "Not Allotted" }, // Time allotted for the meeting
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }, // Add createdAt field
});

MeetingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
