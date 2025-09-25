// features/utils/hooks.js
const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');

const DEFAULT_TIMEOUT = parseInt(process.env.TIMEOUT || '30000');

setDefaultTimeout(DEFAULT_TIMEOUT); // Cucumber step timeout

let browser;
let context;
let page;
let unsupported = false;

BeforeAll(async () => {
  const browserName = process.env.BROWSER || 'chromium';
  const slowMo = parseInt(process.env.SLOWMO || '0');
  const headless = process.env.HEADLESS !== 'false'; // default true

  if (browserName === 'firefox') {
    browser = await firefox.launch({ headless, slowMo });
  } else if (browserName === 'chromium') {
    browser = await chromium.launch({ headless, slowMo });
  } else if (browserName === 'webkit') {
    browser = await webkit.launch({ headless, slowMo });
  } else {
    console.log(`⚠️ Browser "${browserName}" is not registered in hooks.js, skipping tests...`);
    unsupported = true;
  }
});

Before(async () => {
  if (unsupported) return 'skipped';
  context = await browser.newContext();
  page = await context.newPage();

  // Set playwright default timeouts
  page.setDefaultTimeout(DEFAULT_TIMEOUT);            // for actions (click, fill, etc.)
  page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);  // for page.goto, navigation waits

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
