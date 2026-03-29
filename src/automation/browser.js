// automation/browser.js

import puppeteer from "puppeteer";

export const launchBrowser = async () => {
  return await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
    defaultViewport: null
  });
};