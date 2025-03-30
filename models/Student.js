import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true },
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;