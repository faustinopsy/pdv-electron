const bcrypt = require('bcrypt');
class User {
    constructor(id, username, password, role) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.role = role;
    }

    static async findByUsername(username) {
      const db = require('../db/Database');
      const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
      if (row) {
        return row;
      }
      return null;
    }

    static async validatePassword(password, hashedPassword) {
      return await bcrypt.compare(password, hashedPassword);
    }

    static async hashPassword(password) {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    }

    static async create(username, password, role) {
      const db = require('../db/Database');
      const hashedPassword = await this.hashPassword(password);
      try {
        const result = await db.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [username, hashedPassword, role]
        );
        return { id: result.lastID, username, role };
      } catch (err) {
        throw err;
      }
    }

    static async findById(id) {
      const db = require('../db/Database');
      const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
      if (row) {
        const { password, ...userWithoutPassword } = row;
        return userWithoutPassword;
      }
      return null;
    }
}

module.exports = User;