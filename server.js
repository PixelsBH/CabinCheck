import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; 
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Import all models
import "./models/importModels.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import { auth } from "./config/firebase.js"; // Import Firebase auth from firebase.js
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const app = express();
const PORT = process.env.PORT || 5000;

const db = getFirestore(); // Initialize Firestore

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow requests from any origin

// Connect to MongoDB
connectDB();

// Routes
app.use("/routes/auth", authRoutes);
app.use("/routes/teachers", teacherRoutes); // Add teacher routes
app.use("/routes/students", studentRoutes); // Add student routes
app.use("/routes/schedules", scheduleRoutes); // Add schedule routes
app.use("/routes/notifications", notificationRoutes); // Add notification routes
app.use("/routes/meetings", meetingRoutes); // Ensure this is correct

// Default route for root path
app.get("/", (req, res) => {
  res.send("Backend server is running. Use the API routes to interact.");
});

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://172.16.203.181:${PORT}`)); // Replace with your IPv4 address
});
