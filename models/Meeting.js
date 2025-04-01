import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  teacher: { type: String, required: true }, // Ensure this matches the `teacher` field in the query
  student: { type: String, required: true }, // Ensure this matches the `student` field in the query
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  meetTime: { type: String, required: true }, // Store the start time as a string (e.g., "1:00 PM")
  endTime: { 
    type: String, 
    required: true, 
    default: function () {
      const [hour, minute, period] = this.meetTime.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
      let endHour = parseInt(hour) + 1;
      let endPeriod = period;
      if (endHour === 12) endPeriod = period === "AM" ? "PM" : "AM";
      if (endHour > 12) endHour -= 12;
      return `${endHour}:${minute} ${endPeriod}`;
    }
  },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
