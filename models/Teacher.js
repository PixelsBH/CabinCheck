import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true },
  note: { type: String, default: "" },
  office: { type: String, required: false },
  image: { type: String },
  firebaseUID: { type: String },
  fcmToken: { type: String },
});

// Index to speed up name-based searches (especially if you use regex)
TeacherSchema.index({ name: "text" });

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;