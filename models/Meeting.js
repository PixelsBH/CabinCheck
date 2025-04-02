import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, // Teacher's name or ID
  student: { type: String, required: true }, // Student's name or ID
  date: { type: Date, required: true }, // Meeting date
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  meetTime: { type: Date, required: true }, // Start time as a Date
  endTime: { type: Date }, // End time as a Date for TTL (removed `required: true`)
});

// Pre-save middleware to calculate `endTime` directly based on `meetTime`
MeetingSchema.pre("save", function (next) {
  if (this.isModified("meetTime") || this.isNew) {
    const meetDate = new Date(this.meetTime); // Use the provided meetTime
    const endDate = new Date(meetDate); // Clone the meetTime
    endDate.setHours(endDate.getHours() + 1); // Add 1 hour to calculate the actual endTime
    this.endTime = endDate; // Set the endTime to 1 hour after meetTime
  }
  next();
});

// Add a TTL index to the `endTime` field
MeetingSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 }); // Delete exactly at the endTime

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
