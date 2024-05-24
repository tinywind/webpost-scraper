import { ipcRenderer } from 'electron';

const navigatorContext = {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  toggle_maximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  exit: () => ipcRenderer.invoke('window-close'),
  toggle_devtools: () => ipcRenderer.invoke('web-toggle-devtools'),
  open_url: (url: string) => ipcRenderer.invoke('open-url', url),
};

export type NavigatorContextApi = typeof navigatorContext;

export default navigatorContext;
