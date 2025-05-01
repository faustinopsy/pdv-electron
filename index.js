const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

console.log('Iniciando o Electron...');

let mainWindow;

function createWindow() {
  console.log('Criando janela principal...');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen:true,
    transparent:true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  //mainWindow.webContents.openDevTools();


  const loginPath = path.resolve(__dirname, 'src/html/login.html');
  console.log('Verificando login.html:', loginPath);
  if (fs.existsSync(loginPath)) {
    console.log('login.html encontrado.');
  } else {
    console.error('login.html não encontrado.');
  }

  mainWindow.loadFile(loginPath).then(() => {
    console.log('Arquivo login.html carregado.');
  }).catch((err) => {
    console.error('Erro ao carregar login.html:', err);
  });



  mainWindow.on('closed', () => {
    console.log('Janela principal fechada.');
    mainWindow = null;
  });
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

ipcMain.on('navigate-to-main', (event) => {
  const mainPath = path.resolve(__dirname, 'src/html/main.html');
  console.log('Recebido pedido para navegar para:', mainPath);
  if (fs.existsSync(mainPath)) {
    console.log('main.html encontrado.');
    const fileUrl = `file://${mainPath.replace(/\\/g, '/')}`;
    console.log('Carregando URL:', fileUrl);
    mainWindow.loadURL(fileUrl).then(() => {
      console.log('Arquivo main.html carregado via loadURL.');
    }).catch((err) => {
      console.error('Erro ao carregar main.html:', err);
    });
  } else {
    console.error('main.html não encontrado em:', mainPath);
  }
});

ipcMain.on('navigate-to-login', (event) => {
  const mainPath = path.resolve(__dirname, 'src/html/login.html');
  console.log('Recebido pedido para navegar para:', mainPath);
  if (fs.existsSync(mainPath)) {
    console.log('login.html encontrado.');
    const fileUrl = `file://${mainPath.replace(/\\/g, '/')}`;
    console.log('Carregando URL:', fileUrl);
    mainWindow.loadURL(fileUrl).then(() => {
      console.log('Arquivo main.html carregado via loadURL.');
    }).catch((err) => {
      console.error('Erro ao carregar main.html:', err);
    });
  } else {
    console.error('login.html não encontrado em:', mainPath);
  }
});

ipcMain.on('navigate-to-register', (event) => {
  const mainPath = path.resolve(__dirname, 'src/html/register.html');
  console.log('Recebido pedido para navegar para:', mainPath);
  if (fs.existsSync(mainPath)) {
    console.log('register.html encontrado.');
    const fileUrl = `file://${mainPath.replace(/\\/g, '/')}`;
    console.log('Carregando URL:', fileUrl);
    mainWindow.loadURL(fileUrl).then(() => {
      console.log('Arquivo register.html carregado via loadURL.');
    }).catch((err) => {
      console.error('Erro ao carregar register.html:', err);
    });
  } else {
    console.error('register.html não encontrado em:', mainPath);
  }
});