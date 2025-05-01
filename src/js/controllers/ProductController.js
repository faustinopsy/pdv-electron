const path = require('path');
const Product = require(path.resolve(__dirname, '../models/Product'));

class ProductController {
  constructor() {
    this.cachedProducts = null;
  }

  async getAllProducts() {
    if (this.cachedProducts) {
      console.log('[CACHE] Produtos carregados do cache.');
      return this.cachedProducts;
    }
    const products = await Product.findAll();
    this.cachedProducts = products;
    console.log('[DB] Produtos carregados do banco:', products);
    return products;
  }

  async createProduct(name, price, stock) {
    const newProduct = await Product.create(name, price, stock);
    this.clearCache();
    return newProduct;
  }

  async deleteProduct(id) {
    await Product.delete(id);
    this.clearCache();
  }

  async updateProduct(id, name, price, stock) {
    const updated = await Product.update(id, name, price, stock);
    this.clearCache();
    return updated;
  }

  clearCache() {
    this.cachedProducts = null;
  }
}

module.exports = new ProductController();
