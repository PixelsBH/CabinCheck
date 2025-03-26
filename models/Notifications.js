import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["Reminder", "Announcement", "Meeting Request"], required: true },
  date: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
