import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', true); // Suppress the deprecation warning

const uri = process.env.MONGO_URI; // Use the connection string from .env

const connectDB = async () => {
  try {
    await mongoose.connect(uri); // No additional options are needed for modern Mongoose versions
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
