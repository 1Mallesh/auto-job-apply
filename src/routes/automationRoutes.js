// routes/automationRoutes.js

import express from "express";
import { autoApply } from "../controllers/automationController.js";

const router = express.Router();

router.post("/auto-apply", autoApply);

export default router;