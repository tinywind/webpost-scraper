import { contextBridge, ipcRenderer } from 'electron';
import navigatorContext from './navigatorContext';
import utilContext from '@main/window/utilContext';

contextBridge.exposeInMainWorld('electron_window', {
  navigator: navigatorContext,
});

contextBridge.exposeInMainWorld('electron_utils', utilContext);

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigate: (callback: (path: string) => void) => ipcRenderer.on('navigate', (_event, value) => callback(value)),
});
