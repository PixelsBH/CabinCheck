import express from "express";
import Material from "../models/Material.js";

const router = express.Router();

// Fetch all materials
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().populate("teacher");
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching materials", error: error.message });
  }
});

export default router;
