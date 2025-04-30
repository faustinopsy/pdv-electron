const path = require('path');

class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  static async findAll() {
    const db = require(path.resolve(__dirname, '../db/Database'));
    const rows = await db.all('SELECT * FROM products');
    return rows.map(row => new Product(row.id, row.name, row.price, row.stock));
  }

  static async findById(id) {
    const db = require(path.resolve(__dirname, '../db/Database'));
    const row = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (row) {
      return new Product(row.id, row.name, row.price, row.stock);
    }
    return null;
  }

  static async create(name, price, stock) {
    const db = require(path.resolve(__dirname, '../db/Database'));
    const result = await db.run(
      'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
      [name, price, stock]
    );
    return new Product(result.lastID, name, price, stock);
  }

  static async update(id, name, price, stock) {
    const db = require(path.resolve(__dirname, '../db/Database'));
    await db.run(
      'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
      [name, price, stock, id]
    );
    return new Product(id, name, price, stock);
  }

  static async delete(id) {
    const db = require(path.resolve(__dirname, '../db/Database'));
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }
}

module.exports = Product;