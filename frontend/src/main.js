const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200, // Increased width slightly for a better dashboard view
    height: 800,
    backgroundColor: '#111827', // Sets background to dark (matches your theme) to prevent white flashes
    autoHideMenuBar: true,      // Hides the "File Edit View" menu bar for a cleaner app look
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools(); // Commented out for production feel, uncomment to debug

  // --- THE FIX ---
  // This injects CSS directly into the window to remove the white border and double scrollbars.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important; /* Removes the outer "double" scrollbar */
        background-color: #111827; /* Ensures background matches your app theme */
      }
      
      /* Optional: Ensures your React root div takes full height */
      #root {
        height: 100vh;
        width: 100vw;
        overflow-y: auto; /* Keeps the scrollbar ONLY inside the app */
      }
    `);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.