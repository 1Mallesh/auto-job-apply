// controllers/automationController.js

import User from "../models/User.js";
import { launchBrowser } from "../automation/browser.js";
import linkedinStrategy from "../strategies/linkedin.js";
import naukriStrategy from "../strategies/naukri.js";

export const autoApply = async (req, res) => {
  try {
    const { userId, platform } = req.body;

    const user = await User.findById(userId);

    const browser = await launchBrowser();
    const page = await browser.newPage();

    let result;

    if (platform === "linkedin") {
      result = await linkedinStrategy(page, user);
    } else if (platform === "naukri") {
      result = await naukriStrategy(page, user);
    }

    await browser.close();

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};