const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let login;

function createLogin() {
  login = new BrowserWindow({
    width: 400,
    height: 400,
    alwaysOnTop:true,
    frame:false,
    transparent:true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  login.loadFile('src/html/login.html');
  login.on('closed', () => {
    login = null;
  });
}

app.on('ready', createLogin);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
