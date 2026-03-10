import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  firebaseUID: { type: String, required: true, unique: true, index: true },
  rollNo: { type: String, required: true },
  department: { type: String, required: true },
  pinnedTeachers: [{ type: String }], // Array of teacher emails
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;