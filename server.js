import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();

// Import all models
import "./models/importModels.js";
import Teacher from "./models/Teacher.js";
import Availability from "./models/Availability.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Temporarily allow all origins

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes); // Add teacher routes
app.use("/api/availability", availabilityRoutes); // Add availability routes
app.use("/api/students", studentRoutes); // Add student routes
app.use("/api/schedules", scheduleRoutes); // Add schedule routes
app.use("/api/notifications", notificationRoutes); // Add notification routes
app.use("/api/meetings", meetingRoutes); // Add meeting routes
app.use("/api/materials", materialRoutes); // Add material routes

// Test Route
app.get("/api/test", async (req, res) => {
    try {
        const isConnected = mongoose.connection.readyState === 1; // 1 means connected
        if (isConnected) {
            res.status(200).json({ message: "Server and Database are connected ✅" });
        } else {
            res.status(500).json({ message: "Database not connected ❌" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Fetch all teachers with their availability
app.get("/api/teachers", async (req, res) => {
    try {
        const teachers = await Teacher.find().populate("schedule");
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
});

// Fetch availability of a specific teacher
app.get("/api/availability/:teacherId", async (req, res) => {
    try {
        const availability = await Availability.findOne({ teacherId: req.params.teacherId });
        if (!availability) {
            return res.status(404).json({ message: "Availability not found" });
        }
        res.status(200).json(availability);
    } catch (error) {
        res.status(500).json({ message: "Error fetching availability", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
