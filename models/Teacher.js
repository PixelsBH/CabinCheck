import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Available", "In Class", "In Meeting", "Out of Office"], default: "Available" },
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;