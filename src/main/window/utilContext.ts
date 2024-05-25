import { ipcRenderer } from 'electron';
import { FetchResult } from '@main/window/utilIpc';
import { Setting } from '@renderer/types';

const utilContext = {
  fetchSiteData: async (url: string): Promise<FetchResult> => await ipcRenderer.invoke('fetch-site-data', url),
  exportSettings: async (setting: Setting) => await ipcRenderer.invoke('export-settings', setting),
  setDarkMode: () => ipcRenderer.invoke('dark-mode:dark'),
  setLightMode: () => ipcRenderer.invoke('dark-mode:light'),
  useSystemMode: () => ipcRenderer.invoke('dark-mode:system'),
};

export type UtilContextApi = typeof utilContext;

export default utilContext;
