const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));

class UserController {
  async register(username, password, role) {
    try {
      const user = await User.create(username, password, role);
      return user;
    } catch (err) {
      throw new Error('Erro ao cadastrar usuário: ' + err.message);
    }
  }

  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }
}

module.exports = new UserController();