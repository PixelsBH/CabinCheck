import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Link to Google Drive / Firebase
  uploadDate: { type: Date, default: Date.now },
});

const Material = mongoose.model("Material", MaterialSchema);

export default Material;
