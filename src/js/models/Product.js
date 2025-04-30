const path = require('path');
const Database = require(path.resolve(__dirname, './Database'));

class Product {
  static async findAll() {
    const db = await Database.getInstance();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findById(id) {
    const db = await Database.getInstance();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async create(name, price, stock) {
    const db = await Database.getInstance();
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
        [name, price, stock],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, price, stock });
          }
        }
      );
    });
  }

  static async update(id, name, price, stock) {
    const db = await Database.getInstance();
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
        [name, price, stock, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, price, stock });
          }
        }
      );
    });
  }

  static async delete(id) {
    const db = await Database.getInstance();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id });
        }
      });
    });
  }
}

module.exports = Product;