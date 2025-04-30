const path = require('path');
const { ipcRenderer } = require('electron');

try {
  console.log('Tentando carregar AuthController...');
  const AuthController = require(path.resolve(__dirname, '../js/controllers/AuthController'));
  console.log('AuthController carregado com sucesso.');

  class LoginView {
    constructor() {
      this.usernameInput = document.getElementById('username');
      this.passwordInput = document.getElementById('password');
      this.loginButton = document.getElementById('login-btn');
      this.errorMessage = document.getElementById('error-message');
      console.log('LoginView inicializada');
      this.iniciarEventos();
    }

    iniciarEventos() {
      this.loginButton.addEventListener('click', () => this.logar());
    }

    async logar() {
    const user = localStorage.getItem('user');
    if(user){
        ipcRenderer.send('navigate-to-main');
        return
    }
      const username = this.usernameInput.value;
      const password = this.passwordInput.value;
      console.log('Tentativa de login com:', username);
      try {
        const user = await AuthController.login(username, password);
        this.errorMessage.textContent = '';
        console.log('Login bem-sucedido, solicitando navegação para main.html...');
        localStorage.setItem('user', JSON.stringify(user));
        ipcRenderer.send('navigate-to-main');
      } catch (error) {
        console.error('Erro no login:', error.message);
        this.errorMessage.textContent = error.message;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando LoginView');
    new LoginView();
  });
} catch (error) {
  console.error('Erro ao carregar LoginView:', error.message, error.stack);
}