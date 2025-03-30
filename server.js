import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();

// Import all models
import "./models/importModels.js";
import Teacher from "./models/Teacher.js"; // Import Teacher model
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import { extractRollNo } from "./utils/rollNoUtils.js";
import { auth } from "./config/firebase.js"; // Import Firebase auth from firebase.js
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const app = express();
const PORT = process.env.PORT || 5000;

const db = getFirestore(); // Initialize Firestore

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the frontend

// Connect to MongoDB
connectDB();

// Routes
app.use("/routes/auth", authRoutes);
app.use("/routes/teachers", teacherRoutes); // Add teacher routes
app.use("/routes/students", studentRoutes); // Add student routes
app.use("/routes/schedules", scheduleRoutes); // Add schedule routes
app.use("/routes/notifications", notificationRoutes); // Add notification routes
app.use("/routes/meetings", meetingRoutes); // Add meeting routes

// Fetch all teachers with their availability
app.get("/api/teachers", async (req, res) => {
    try {
        const teachers = await Teacher.find().populate("schedule");
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
});

// Create a new student
app.post("/api/students", async (req, res) => {
    try {
        const { firebaseUID } = req.body;

        // Fetch user data from Firestore
        const userDoc = doc(db, "users", firebaseUID);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            return res.status(404).json({ message: "User not found in Firestore" });
        }

        const userData = userSnapshot.data();
        const { name, email } = userData;

        const rollNo = extractRollNo(email); // Compute roll number from email

        if (rollNo === "Invalid Email") {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const newStudent = new Student({ name, email, firebaseUID, rollNo });
        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
});
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
