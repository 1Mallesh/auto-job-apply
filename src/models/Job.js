// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  url: String,
  platform: String, // linkedin, naukri, etc
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);