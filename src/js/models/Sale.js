const path = require('path');

class Sale {
  constructor(id, userId, total, date, items = []) {
    this.id = id;
    this.userId = userId;
    this.total = total;
    this.date = date;
    this.items = items;
  }

  static async create(userId, items) {
    const db = require('../db/Database');
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const date = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO sales (user_id, total, date) VALUES (?, ?, ?)',
      [userId, total, date]
    );
    const saleId = result.lastID;

    for (const item of items) {
      await db.run(
        'INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [saleId, item.productId, item.quantity, item.price]
      );
      await db.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    return new Sale(saleId, userId, total, date, items);
  }
}

module.exports = Sale;