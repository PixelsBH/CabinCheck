import express from "express";
import Availability from "../models/Availability.js";

const router = express.Router();

// Fetch availability of a specific teacher
router.get("/:teacherId", async (req, res) => {
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

export default router;
