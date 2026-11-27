import { ipcMain, shell } from 'electron';
import { getAppWindow } from '@main/appWindow';
import { webUrl } from '@common/webUrl';

export const registerNavigatorIpc = () => {
  ipcMain.handle('window-minimize', () => getAppWindow()?.minimize());
  ipcMain.handle('window-maximize', () => getAppWindow()?.maximize());
  ipcMain.handle('window-toggle-maximize', () => {
    const window = getAppWindow();
    if (window?.isMaximized()) window.unmaximize();
    else window?.maximize();
  });
  ipcMain.handle('window-close', () => getAppWindow()?.close());
  ipcMain.handle('web-toggle-devtools', () => getAppWindow()?.webContents.toggleDevTools());
  ipcMain.handle('open-url', (_, value: unknown) => {
    const url = webUrl(value);
    if (!url) throw new Error('Expected an HTTP or HTTPS URL');
    return shell.openExternal(url.href);
  });
};
