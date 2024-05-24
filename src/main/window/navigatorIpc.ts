import { BrowserWindow, ipcMain, shell } from 'electron';

export const registerNavigatorIpc = (mainWindow: BrowserWindow) => {
  ipcMain.handle('window-minimize', () => mainWindow.minimize());
  ipcMain.handle('window-maximize', () => mainWindow.maximize());
  ipcMain.handle('window-toggle-maximize', () => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
  ipcMain.handle('window-close', () => mainWindow.close());
  ipcMain.handle('web-toggle-devtools', () => mainWindow.webContents.toggleDevTools());
  ipcMain.handle('open-url', (e, url) => shell.openExternal(url));
};
