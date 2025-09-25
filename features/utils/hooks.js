// features/utils/hooks.js
const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

setDefaultTimeout(60 * 1000);

let browser;
let context;
let page;
let unsupported = false; // track unsupported browsers

BeforeAll(async () => {
  const browserName = process.env.BROWSER || 'chromium';

  if (browserName === 'firefox') {
    browser = await firefox.launch({ headless: false, slowMo: 200 });
  } else if (browserName === 'chromium') {
    browser = await chromium.launch({ headless: false, slowMo: 200 });
  } else if (browserName === 'webkit') {
    browser = await webkit.launch({ headless: false, slowMo: 200 });
  } else {
    console.log(`⚠️ Browser "${browserName}" is not registered in hooks.js, skipping tests...`);
    unsupported = true;
  }
});

// Only register these hooks if supported
Before(async () => {
  if (unsupported) return 'skipped';  // <-- Cucumber will mark scenario as skipped
  context = await browser.newContext();
  page = await context.newPage();
  global.page = page;
});

After(async () => {
  if (unsupported) return;
  if (page) await page.close();
  if (context) await context.close();
});

AfterAll(async () => {
  if (unsupported) return;
  if (browser) await browser.close();
});
