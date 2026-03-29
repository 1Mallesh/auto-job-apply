// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: [String],
  resume: String,

  // 🔥 Login credentials for automation
  linkedinEmail: String,
  linkedinPassword: String,
  naukriEmail: String,
  naukriPassword: String,

}, { timestamps: true });

export default mongoose.model("User", userSchema);