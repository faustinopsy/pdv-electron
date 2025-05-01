const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));
const bcrypt = require('bcrypt');
class AuthController {
  async login(username, password) {
    const user = await User.findByUsername(username);
    if (user && await this.validatePassword(password, user.password )) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new Error('Credenciais inválidas');
  }
  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}

module.exports = new AuthController();