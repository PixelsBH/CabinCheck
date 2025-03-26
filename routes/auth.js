import express from "express";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { uid, displayName, email, photoURL } = req.body;

    try {
        console.log("Login request received:", { uid, displayName, email, photoURL });

        // Check if the user exists in the Teacher collection
        let user = await Teacher.findOne({ firebaseUID: uid });
        console.log("Teacher lookup result:", user);

        // If not found in Teacher, check in Student
        if (!user) {
            user = await Student.findOne({ firebaseUID: uid });
            console.log("Student lookup result:", user);
        }

        // If user doesn't exist, create a new Student entry (default behavior)
        if (!user) {
            console.log("User not found, creating new Student entry...");
            user = new Student({
                name: displayName,
                email,
                firebaseUID: uid
            });
            await user.save();
            console.log("New Student created:", user);
        }

        res.status(200).json({
            uid: user.firebaseUID,
            name: user.name,
            email: user.email,
            photoURL
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
