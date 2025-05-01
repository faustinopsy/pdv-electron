const path = require('path');
const { ipcRenderer } = require('electron');

try {
  console.log('Tentando carregar UserController...');
  const UserController = require(path.resolve(__dirname, '../js/controllers/UserController'));
  console.log('UserController carregado com sucesso.');

  class RegisterView {
    constructor() {
      this.usernameInput = document.getElementById('reg-username');
      this.passwordInput = document.getElementById('reg-password');
      this.roleInput = document.getElementById('reg-role');
      this.login = document.getElementById('login-btn');
      this.registerButton = document.getElementById('register-btn');
      this.errorMessage = document.getElementById('register-error-message');
      this.successMessage = document.getElementById('register-success-message');
      console.log('RegisterView inicializada');
      this.iniciarEventos();
    }

    iniciarEventos() {
      this.registerButton.addEventListener('click', () => this.cadastrar());
      this.login.addEventListener('click', () => this.logar());
    }

    async logar() {
        try {
          ipcRenderer.send('navigate-to-login');
        } catch (error) {
          this.successMessage.textContent = '';
          this.errorMessage.textContent = error.message;
        }
    }
  
    async cadastrar() {
      const username = this.usernameInput.value;
      const password = this.passwordInput.value;
      const role = this.roleInput.value;
      try {
        const user = await UserController.register(username, password, role);
        this.errorMessage.textContent = '';
        this.successMessage.textContent = 'Usuário cadastrado com sucesso!';
        ipcRenderer.send('navigate-to-login');
      } catch (error) {
        this.successMessage.textContent = '';
        this.errorMessage.textContent = error.message;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new RegisterView();
  });
} catch (error) {
  console.error('Erro ao carregar RegisterView:', error.message, error.stack);
}