import express from "express";
import { createJob, getJobs, runAutomation } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/run", runAutomation);

export default router;