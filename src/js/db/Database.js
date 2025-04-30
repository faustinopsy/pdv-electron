const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '../../../pdv.db');
    console.log('Caminho do banco de dados:', dbPath);
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
      } else {
        console.log('Conectado ao banco SQLite.');
        this.init();
      }
    });
  }

  init() {
    console.log('Inicializando o banco de dados...');
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('admin', 'funcionario'))
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela users:', err.message);
        } else {
          console.log('Tabela users criada ou já existe.');
          this.db.run(`
            INSERT OR IGNORE INTO users (username, password, role)
            VALUES ('admin', 'admin123', 'admin')
          `, (err) => {
            if (err) {
              console.error('Erro ao inserir usuário admin:', err.message);
            } else {
              console.log('Usuário admin inserido ou já existe.');
            }
          });
        }
      });
    });
  }

  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          console.error('Erro ao executar query:', query, err.message);
          reject(err);
        } else {
          console.log('Query executada com sucesso:', query);
          resolve(this);
        }
      });
    });
  }

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          console.error('Erro ao obter dados:', query, err.message);
          reject(err);
        } else {
          console.log('Dados obtidos:', row);
          resolve(row);
        }
      });
    });
  }
}

module.exports = new Database();