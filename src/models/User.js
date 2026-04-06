// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,

  password: String, // ✅ NEW
  skills: [String],
  resume: String,

  // 🔥 Login credentials for automation
  linkedinEmail: String,
  linkedinPassword: String,
  naukriEmail: String,
  naukriPassword: String,
   // 🔐 OTP for forgot password
  otp: String,
  otpExpiry: Date,

}, { timestamps: true });

export default mongoose.model("User", userSchema);