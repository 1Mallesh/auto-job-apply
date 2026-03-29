// src/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";


import automationRoutes from "./routes/automationRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/automation", automationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/automation", automationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});