import http from "http";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors"; 
import dotenv from "dotenv";
import { verifyFirebaseToken } from "./middlewares/authMiddleware.js";
import { Server } from "socket.io";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve React frontend
app.use(express.static(path.join(__dirname, "dist")));

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

// Create raw HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store connected students
const connectedStudents = new Map();

io.on("connection", (socket) => {
  socket.on("join", (firebaseUID) => {
    connectedStudents.set(firebaseUID, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [uid, id] of connectedStudents.entries()) {
      if (id === socket.id) {
        connectedStudents.delete(uid);
        break;
      }
    }
  });
});

// Catch-all to serve index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Connect Mongo and start server
connectDB().then(() => {
  server.listen(PORT, '192.168.56.1', () => {
    console.log(`Server running on http://192.168.56.1:${PORT}`);
  });
});
