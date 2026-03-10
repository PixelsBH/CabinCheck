import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  teacher: { type: String, required: true, index: true },
  years: { type: String, required: true, default: 'all', index: true },
  departments: { type: [String], required: true, default: ['ALL'], index: true },
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
