import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  teacher: { type: String, required: true },
  years: { type: String, required: true, default: 'all' },
  departments: { type: [String], required: true, default: ['ALL'] },
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
