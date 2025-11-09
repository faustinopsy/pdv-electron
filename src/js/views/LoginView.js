const { ipcRenderer } = require('electron');
const path = require('path');
const AuthController = require(path.resolve(__dirname, '../js/controllers/AuthController'));

class LoginView {
  constructor() {
    this.usernameInput = document.getElementById('username');
    this.passwordInput = document.getElementById('password');
    this.loginButton = document.getElementById('login-btn');
    this.windowClose = document.getElementById('close-btn');
    this.errorMessage = document.getElementById('error-message');
    this.iniciarEventos();
  }

  iniciarEventos() {
    this.loginButton.addEventListener('click', () => this.logar());
     this.windowClose.addEventListener('click', () => ipcRenderer.send('close-window'));
  }

  async logar() {
    
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    try {
      const user = await AuthController.login(username, password);
      this.errorMessage.textContent = '';
      alert(`Bem-vindo, ${user.username}! Role: ${user.role}`);
    } catch (error) {
      this.errorMessage.textContent = error.message;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LoginView();
});