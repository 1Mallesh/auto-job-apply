import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 🔥 validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashed,
    });

    res.json({ msg: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN (email OR phone)
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password required" });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    // 🔥 IMPORTANT FIX
    if (!user || !user.password) {
      return res.status(400).json({ msg: "User not found or password missing" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // ✅ important for frontend
      secure: false,
    });

    res.json({ msg: "Login success" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logout success" });
};

// ✅ FORGOT PASSWORD (OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    console.log("🔐 OTP:", otp); // simulate email/sms

    res.json({ msg: "OTP sent (check console)" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, newPassword } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};