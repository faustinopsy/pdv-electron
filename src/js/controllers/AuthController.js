const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));

class AuthController {
  async login(username, password) {
    const user = await User.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    throw new Error('Credenciais inválidas');
  }
}

module.exports = new AuthController();