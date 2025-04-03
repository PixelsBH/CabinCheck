import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  teacher: { type: String, required: true }, // New field for teacher's name
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
