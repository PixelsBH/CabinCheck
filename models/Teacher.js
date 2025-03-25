const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Available", "In Class", "In Meeting", "Out of Office"], default: "Available" },
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
});

module.exports = mongoose.model("Teacher", TeacherSchema);