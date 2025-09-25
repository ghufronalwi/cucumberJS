const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');        // <<-- import here
const LoginPage = require('../../pages/login');
const AddToCartPage = require('../../pages/addToCart');

let loginPage;
let addToCartPage;

Given('I am on the SauceDemo login page', async () => {
  loginPage = new LoginPage(page);
  await loginPage.open();
});

When('I login with valid credentials', async () => {
  await loginPage.login('standard_user', 'secret_sauce');
});

When('I login with locked out credentials', async () => {
  await loginPage.login('locked_out_user', 'secret_sauce');
});

Then('I should be redirected to the inventory page', async () => {
  addToCartPage = new AddToCartPage(page);
  await addToCartPage.waitForLoad();
  // Playwright expect for page URL
  await expect(page).toHaveURL(/.*inventory.html/);
});

Then('I should see a login error message', async () => {
  // Use locator assertion (safer than fetching text)
  await expect(page.locator(loginPage.errorMessage)).toHaveText(/Epic sadface/);
});
