const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

setDefaultTimeout(60 * 1000);

let browser;
let context;
let page;

BeforeAll(async () => {
  browser = await chromium.launch({
    headless: false,   // set to true in CI
    slowMo: 500        // <<-- 500ms delay between actions
  });
});

Before(async () => {
  context = await browser.newContext();
  page = await context.newPage();
  global.page = page;
});

After(async () => {
  await page.close();
  await context.close();
});

AfterAll(async () => {
  await browser.close();
});