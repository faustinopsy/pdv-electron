const { app, BrowserWindow } = require('electron');
const path = require('path');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/html/login.html').then(() => {
  }).catch((err) => {
    console.error('Erro ao carregar login.html:', err);
  });

  mainWindow.on('closed', () => {
    console.log('Janela principal fechada.');
    mainWindow = null;
  });

  //mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  console.log('Electron pronto, inicializando janela...');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('Todas as janelas fechadas.');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('Aplicação ativada.');
  if (mainWindow === null) {
    createWindow();
  }
});