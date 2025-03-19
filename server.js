const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
require("dotenv").config();

// Import all models
require("./models/importModels");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
