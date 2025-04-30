const path = require('path');
const Sale = require(path.resolve(__dirname, '../models/Sale'));

class SaleController {
  async createSale(userId, items) {
    return await Sale.create(userId, items);
  }
}

module.exports = new SaleController();