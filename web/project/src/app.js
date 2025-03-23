const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schemas
const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  time: String,
  type: String,
});

const ProfessorSchema = new mongoose.Schema({
  name: String,
  department: String,
  availability: Boolean,
});

const MeetingRequestSchema = new mongoose.Schema({
  studentName: String,
  professorName: String,
  time: String,
  status: { type: String, default: "Pending" },
});

// Create Mongoose Models
const Notification = mongoose.model("Notification", NotificationSchema);
const Professor = mongoose.model("Professor", ProfessorSchema);
const MeetingRequest = mongoose.model("MeetingRequest", MeetingRequestSchema);

// 🟢 API to Get Notifications
app.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟢 API to Get Professors
app.get("/professors", async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟢 API to Send Meeting Request (POST)
app.post("/meeting-request", async (req, res) => {
  try {
    const { studentName, professorName, time } = req.body;
    if (!studentName || !professorName || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMeetingRequest = new MeetingRequest({ studentName, professorName, time });
    await newMeetingRequest.save();

    res.status(201).json({ message: "Meeting request sent successfully!" });
  } catch (error) {
    console.error("Error sending meeting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
