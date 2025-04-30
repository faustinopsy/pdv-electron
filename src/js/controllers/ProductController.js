const path = require('path');
const Product = require(path.resolve(__dirname, '../models/Product'));

class ProductController {
  async getAllProducts() {
    return await Product.findAll();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(name, price, stock) {
    return await Product.create(name, price, stock);
  }

  async updateProduct(id, name, price, stock) {
    return await Product.update(id, name, price, stock);
  }

  async deleteProduct(id) {
    await Product.delete(id);
  }
}

module.exports = new ProductController();