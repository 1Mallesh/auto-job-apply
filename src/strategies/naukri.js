// strategies/naukri.js
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const naukriStrategy = async (page, user) => {
  try {
    console.log("🚀 Starting Naukri automation");

    page.setDefaultTimeout(60000);

    // =========================
    // 🔐 LOGIN
    // =========================
    await page.goto("https://www.naukri.com/nlogin/login");
    await page.waitForSelector("#usernameField");
    await page.type("#usernameField", user.naukriEmail, { delay: 100 });
    await page.type("#passwordField", user.naukriPassword, { delay: 100 });
    await page.click("button[type='submit']");

    // ✅ Wait for profile icon to confirm login
    await page.waitForSelector(".nI-gNb-drawer__bars", { timeout: 30000 });
    console.log("✅ Logged into Naukri");

    // =========================
    // 🔍 SEARCH USING HEADER FORM
    // =========================
    await page.goto("https://www.naukri.com/mnjuser/homepage");
    await delay(4000);

    // Fill keywords / designation
    const keywordsInput = await page.$("input[placeholder*='Skills, Designation, Companies']");
    if (keywordsInput) {
      for (let skill of user.skills) {
        await keywordsInput.type(skill + " ", { delay: 100 });
      }
    }

    // Fill location
    const locationInput = await page.$("input[placeholder*='Location']");
    if (locationInput) await locationInput.type("India", { delay: 100 });

    // Fill experience
    const expMinSelect = await page.$("select[name='expMin']");
    const expMaxSelect = await page.$("select[name='expMax']");
    if (expMinSelect) await expMinSelect.select("0");
    if (expMaxSelect) await expMaxSelect.select("5");

    // Click Search button
    const searchBtn = await page.$("button[type='submit']");
    if (searchBtn) await searchBtn.click();
    await delay(5000);

    // =========================
    // 🔽 SCROLL AND LOAD JOBS
    // =========================
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel({ deltaY: 2000 });
      await delay(2000);
    }

    // =========================
    // 📝 SELECT JOB CARDS
    // =========================
    const jobs = await page.$$("div.jobTuple, div[data-job-id]");
    console.log("📊 Jobs found:", jobs.length);

    for (let i = 0; i < Math.min(jobs.length, 20); i++) { // apply max 20 jobs
      try {
        const link = await jobs[i].$("a");
        if (!link) continue;

        const jobUrl = await page.evaluate(el => el.href, link);
        await page.goto(jobUrl);
        await delay(4000);

        // =========================
        // 🚀 APPLY AUTOMATION
        // =========================
        const applyBtn =
          await page.$("button.apply-button") ||
          await page.$("button[class*='apply']") ||
          await page.$("a[class*='apply']");

        if (!applyBtn) {
          console.log("❌ No Apply button for job", i + 1);
          await page.goBack();
          continue;
        }

        console.log("🚀 Applying job:", i + 1);
        await applyBtn.click();
        await delay(4000);

        console.log("✅ Applied / Redirected");
        await page.goBack();
        await delay(3000);

      } catch (err) {
        console.log("⚠️ Error applying job:", err.message);
      }
    }

    return { status: "completed" };

  } catch (err) {
    console.error("❌ Error:", err.message);
    return { status: "failed", message: err.message };
  }
};

export default naukriStrategy;