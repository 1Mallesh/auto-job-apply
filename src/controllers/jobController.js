import Job from "../models/Job.js";
import { applyJobs } from "../automation/jobApplicator.js";

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

export const runAutomation = async (req, res) => {
  const jobs = await Job.find({ status: "pending" });

  if (jobs.length === 0) {
    return res.json({ message: "No pending jobs" });
  }

  await applyJobs(jobs);

  res.json({ message: "Automation completed" });
};