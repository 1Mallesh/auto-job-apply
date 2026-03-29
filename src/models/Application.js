// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  status: {
    type: String,
    enum: ["applied", "failed", "pending"],
    default: "pending",
  },
  message: String,
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);