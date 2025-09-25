const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');        // <<-- import here
const LoginPage = require('../../pages/login');
const AddToCartPage = require('../../pages/addToCart');

let loginPage;
let addToCartPage;

Given('I am logged in as a standard user', async () => {
  loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  addToCartPage = new AddToCartPage(page);
  await addToCartPage.waitForLoad();
});

When('I select {int} random items from the inventory', async (count) => {
  await addToCartPage.addRandomItems(count);
});

Then('I should see {int} items in the shopping cart', async (count) => {
  // Assert cart badge text equals expected count
  await expect(page.locator(addToCartPage.cartBadge)).toHaveText(String(count));
});
