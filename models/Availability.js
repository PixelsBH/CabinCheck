import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["In Cabin", "In Class", "In Meeting", "Out of Office"] },
  available_after: String, // Example: "12:00 PM"
  last_updated: { type: Date, default: Date.now },
});

const Availability = mongoose.model("Availability", AvailabilitySchema);

export default Availability;
