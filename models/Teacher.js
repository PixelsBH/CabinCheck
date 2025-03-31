import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true }, 
  subjects: [{ type: String }], 
  office: { type: String, required: false }, 
  image: { type: String }, 
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  firebaseUID: { type: String }, 
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;