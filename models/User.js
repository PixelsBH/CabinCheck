const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["teacher", "student"] },
  firebaseUID: String, // Firebase Auth ID
});

module.exports = mongoose.model("User", UserSchema);
