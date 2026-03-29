// automation/jobApplicator.js
import { launchBrowser } from "./browser.js";
import linkedinStrategy from "../strategies/linkedin.js";
import naukriStrategy from "../strategies/naukri.js";
import genericStrategy from "../strategies/generic.js";

export const applyToJob = async (job, user) => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(job.url, { waitUntil: "networkidle2" });

    let strategy;

    if (job.platform === "linkedin") {
      strategy = linkedinStrategy;
    } else if (job.platform === "naukri") {
      strategy = naukriStrategy;
    } else {
      strategy = genericStrategy;
    }

    const result = await strategy(page, user);

    await browser.close();
    return result;

  } catch (err) {
    await browser.close();
    return { status: "failed", message: err.message };
  }
};