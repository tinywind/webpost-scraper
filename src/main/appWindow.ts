import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerNavigatorIpc } from '@main/window/navigatorIpc';
import { registerUtilIpc } from '@main/window/utilIpc';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export async function createAppWindow(): Promise<BrowserWindow> {
  appWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    backgroundColor: '#202020',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.resolve('assets/images/appIcon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });

  appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

  appWindow.on('ready-to-show', () => {
    appWindow.show();
    if (process.env.NODE_ENV === 'development') appWindow.webContents.toggleDevTools();
  });

  registerNavigatorIpc(appWindow);
  registerUtilIpc();

  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}
