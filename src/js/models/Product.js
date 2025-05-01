const path = require('path');
const Database = require(path.resolve(__dirname, '../db/Database'));

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
    console.log('Product.create: Criando produto:', { name, price, stock });
    return new Promise((resolve, reject) => {
      Database.run(
        'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
        [name, price, stock],
        function (err) {
          if (err) {
            console.error('Product.create: Erro na inserção:', err.message);
            reject(new Error(err.message || err));
          } else {
            console.log('Product.create: Produto criado com ID:', this.lastID);
            resolve({ id: this.lastID, name, price, stock });
          }
        }
      );
    });
  }

  static async update(id, name, price, stock) {
    console.log('Product.update: Atualizando produto ID:', id, { name, price, stock });
    return new Promise((resolve, reject) => {
      Database.run(
        'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
        [name, price, stock, id],
        function (err) {
          if (err) {
            console.error('Product.update: Erro na atualização:', err.message);
            reject(err instanceof Error ? err : new Error(err.message || err));
          } else {
            console.log('Product.update: Produto atualizado:', { id, name, price, stock });
            resolve({ id, name, price, stock });
          }
        }
      );
    });
  }

  static async delete(id) {
    console.log('Product.delete: Deletando produto ID:', id);
    return new Promise((resolve, reject) => {
      Database.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Product.delete: Erro na deleção:', err.message);
          reject(err);
        } else {
          console.log('Product.delete: Produto deletado:', { id });
          resolve({ id });
        }
      });
    });
  }
}

module.exports = Product;