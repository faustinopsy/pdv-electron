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
        return new User(row.id, row.username, row.password, row.role);
      }
      return null;
    }
  }
  
  module.exports = User;