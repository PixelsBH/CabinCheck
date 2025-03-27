import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();

// Import all models
import "./models/importModels.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Temporarily allow all origins

// Connect to MongoDB
connectDB();

// Routes
app.use("/routes/auth", authRoutes);
app.use("/routes/teachers", teacherRoutes); // Add teacher routes
app.use("/routes/students", studentRoutes); // Add student routes
app.use("/routes/schedules", scheduleRoutes); // Add schedule routes
app.use("/routes/notifications", notificationRoutes); // Add notification routes
app.use("/routes/meetings", meetingRoutes); // Add meeting routes

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


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
