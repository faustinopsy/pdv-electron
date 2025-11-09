const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  function closeWindow(){
    if (mainWindow) {
      mainWindow.close();
    }
  }
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

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

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