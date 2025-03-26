import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();

// Import all models
import "./models/importModels.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Temporarily allow all origins

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
