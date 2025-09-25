class AddToCartPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = '.inventory_item';
    this.cartBadge = '.shopping_cart_badge';
  }

  async waitForLoad() {
    await this.page.waitForSelector('.inventory_list');
  }

  async getInventoryItems() {
    return this.page.$$(this.inventoryItems);
  }

  async addRandomItems(count) {
    const items = await this.getInventoryItems();
    const indexes = [...Array(items.length).keys()];
    const selected = indexes.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const i of selected) {
      const addButton = await items[i].$('button');
      await addButton.click();
    }
  }

  async getCartCount() {
    return parseInt(await this.page.textContent(this.cartBadge));
  }
}

module.exports = AddToCartPage;
