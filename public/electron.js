const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    // Set a nice default background color to match your app
    backgroundColor: '#1a1a1a',
  });

  // Load the app
  const indexPath = path.join(__dirname, '..', 'build', 'index.html');
  const startUrl = !app.isPackaged 
    ? 'http://localhost:3000'
    : `file://${indexPath}`;

  console.log('App is packaged:', app.isPackaged);
  console.log('Loading URL:', startUrl);
  console.log('Current directory:', __dirname);
  console.log('Index path:', indexPath);
  
  // Open DevTools only in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Listen for did-fail-load event
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorCode, errorDescription);
  });

  // Listen for dom-ready event
  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM is ready');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 