const delay = (ms) => new Promise(res => setTimeout(res, ms));

export default async (page, user) => {
  try {
    console.log("🚀 Starting LinkedIn automation");

    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(0);

    // =========================
    // 🔐 LOGIN
    // =========================
    await page.goto("https://www.linkedin.com/login");

    await page.waitForSelector("#username");

    await page.type("#username", user.linkedinEmail, { delay: 100 });
    await page.type("#password", user.linkedinPassword, { delay: 100 });

    await page.click("button[type='submit']");
    await delay(8000);

    console.log("✅ Logged in to LinkedIn");

    // =========================
    // 🔍 SEARCH LOOP
    // =========================
    for (let skill of user.skills) {
      console.log("🔍 Searching:", skill);

      await page.goto(
        `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
          skill
        )}&location=India&f_AL=true`
      );

      // ✅ WAIT USING MULTIPLE FALLBACK SELECTORS
      await Promise.race([
        page.waitForSelector("ul.jobs-search__results-list", { timeout: 20000 }),
        page.waitForSelector(".jobs-search-results", { timeout: 20000 }),
        page.waitForSelector("div.scaffold-layout__list", { timeout: 20000 })
      ]);

      await delay(4000);

      // 🔍 DEBUG (see page content)
      const title = await page.title();
      console.log("📄 Page title:", title);

      // 🔽 Scroll
      for (let i = 0; i < 5; i++) {
        await page.mouse.wheel({ deltaY: 2000 });
        await delay(2000);
      }

      const jobs = await page.$$("a.job-card-container__link");

      console.log("📊 Jobs found:", jobs.length);

      if (jobs.length === 0) {
        console.log("❌ No jobs found — possible reasons:");
        console.log("👉 CAPTCHA / blocked / wrong selector");
        continue;
      }

      // =========================
      // 🚀 APPLY LOOP
      // =========================
      for (let i = 0; i < Math.min(jobs.length, 5); i++) {
        try {
          await jobs[i].click();
          await delay(4000);

          const applyBtn = await page.$("button.jobs-apply-button");

          if (!applyBtn) {
            console.log("❌ No Easy Apply");
            continue;
          }

          console.log("🚀 Applying job:", i + 1);

          await applyBtn.click();
          await delay(3000);

          // Upload resume
          const upload = await page.$('input[type="file"]');
          if (upload && user.resume) {
            await upload.uploadFile(user.resume);
          }

          const submit = await page.$(
            "button[aria-label='Submit application']"
          );

          if (submit) {
            await submit.click();
            console.log("✅ Applied");
          }

          const close = await page.$("button[aria-label='Dismiss']");
          if (close) await close.click();

          await delay(3000 + Math.random() * 2000);

        } catch (err) {
          console.log("⚠️ Apply error:", err.message);
        }
      }
    }

    return { status: "completed" };

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
    return { status: "failed", message: err.message };
  }
};