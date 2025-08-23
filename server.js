import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import cors from "cors"; 
import dotenv from "dotenv";
import { verifyFirebaseToken } from "./middlewares/authMiddleware.js";

dotenv.config();

// Import all models
import "./models/importModels.js";

// Import all routes
import authRoutes from "./routes/auth.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js"; // Import meeting routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow requests from any origin

// Connect to MongoDB
connectDB();

// Routes
app.use("/routes/auth", authRoutes);

app.use("/routes/teachers",verifyFirebaseToken, teacherRoutes); // Add teacher routes
app.use("/routes/students",verifyFirebaseToken, studentRoutes); // Add student routes
app.use("/routes/schedules",verifyFirebaseToken, scheduleRoutes); // Add schedule routes
app.use("/routes/notifications",verifyFirebaseToken, notificationRoutes); // Add notification routes
app.use("/routes/meetings",verifyFirebaseToken, meetingRoutes); // Add meeting routes

// Default route for root path
app.get("/", (req, res) => {
  res.send("Backend server is running. Use the API routes to interact.");
});

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://192.168.56.1:${PORT}`)); // Replace with your IPv4 address
});
