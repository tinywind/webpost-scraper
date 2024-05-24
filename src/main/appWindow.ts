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
export function createAppWindow(): BrowserWindow {
  appWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

  appWindow.on('ready-to-show', () => appWindow.show());

  registerMainIPC();

  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}

function registerMainIPC() {
  registerNavigatorIpc(appWindow);
  registerUtilIpc();
}
