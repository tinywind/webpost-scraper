import { ipcRenderer } from 'electron';

let navigateAction: (path: string) => unknown = () => {};

const navigatorContext = {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  toggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  exit: () => ipcRenderer.invoke('window-close'),
  toggleDevtools: () => ipcRenderer.invoke('web-toggle-devtools'),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  setTheme: (value: string) => {
    if (value === 'system') ipcRenderer.invoke('dark-mode:system');
    if (value === 'dark') ipcRenderer.invoke('dark-mode:dark');
    if (value === 'light') ipcRenderer.invoke('dark-mode:light');
  },
  setNavigateAction: (callback: (path: string) => void) => (navigateAction = callback),
  navigate: (path: string) => navigateAction(path),
};

export type NavigatorContextApi = typeof navigatorContext;

export default navigatorContext;
