import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerNavigatorIpc } from '@main/window/navigatorIpc';
import { registerUtilIpc } from '@main/window/utilIpc';
import navigatorMenus from '@renderer/navigatorMenus';

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
    width: process.env.NODE_ENV === 'development' ? 1920 : 800,
    height: process.env.NODE_ENV === 'development' ? 1080 : 600,
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
  });

  registerNavigatorIpc(appWindow);
  registerUtilIpc();

  appWindow.on('close', () => {
    appWindow = null;
    app.quit();
  });

  if (process.env.NODE_ENV === 'development') appWindow.webContents.toggleDevTools();

  appWindow.webContents.on('before-input-event', (event, input) => {
    const menus = navigatorMenus.flatMap(e => e.items).filter(e => e.shortcut && typeof e.shortcut !== 'string' && e.shortcut.key);
    const isShortcut = menus.some(menu => {
      const shortcut = menu.shortcut as { label: string; ctrl?: boolean; alt?: boolean; shift?: boolean; key: string };
      const isCtrlMatch = (shortcut.ctrl && input.control) || (!shortcut.ctrl && !input.control);
      const isAltMatch = (shortcut.alt && input.alt) || (!shortcut.alt && !input.alt);
      const isShiftMatch = (shortcut.shift && input.shift) || (!shortcut.shift && !input.shift);
      const isKeyMatch = shortcut.key === input.key || shortcut.key === input.code;
      return isCtrlMatch && isAltMatch && isShiftMatch && isKeyMatch;
    });

    const keysToBlock = [...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)];
    if (!isShortcut && (input.control || input.alt || input.shift || keysToBlock.includes(input.key))) {
      event.preventDefault();
      console.log(`Blocked key: ${input.key}`);
    }
  });

  return appWindow;
}

export function getAppWindow(): BrowserWindow {
  return appWindow;
}
