import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  meetTime: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
