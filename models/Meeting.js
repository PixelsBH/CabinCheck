import mongoose from "mongoose";


const MeetingSchema = new mongoose.Schema({
  teacher: { type: String, ref: "Teacher", required: true },
  student: { type: String, ref: "Student", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
