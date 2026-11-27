import { ipcRenderer } from 'electron';
import { FetchResult } from '@main/window/utilIpc';
import { Setting, Site, Post } from '@src/types';

const utilContext = {
  fetchSiteData: async (url: string): Promise<FetchResult> => await ipcRenderer.invoke('fetch-site-data', url),
  exportSettings: () => ipcRenderer.invoke('export-settings'),
  setDarkMode: () => ipcRenderer.invoke('dark-mode:dark'),
  setLightMode: () => ipcRenderer.invoke('dark-mode:light'),
  useSystemMode: () => ipcRenderer.invoke('dark-mode:system'),
  save: async (setting: Setting): Promise<Setting> => ipcRenderer.invoke('repository:save', setting),
  load: async (): Promise<Setting> => ipcRenderer.invoke('repository:load'),
  insertSite: async (site: Site): Promise<Setting> => ipcRenderer.invoke('repository:site:insert', site),
  updateSite: async (site: Site): Promise<Setting> => ipcRenderer.invoke('repository:site:update', site),
  deleteSite: async (id: string): Promise<Setting> => ipcRenderer.invoke('repository:site:delete', id),
  setPollingInterval: async (pollingInterval: number): Promise<Setting> => ipcRenderer.invoke('repository:attribute:setPollingInterval', pollingInterval),
  setRetention: async (retention: number): Promise<Setting> => ipcRenderer.invoke('repository:attribute:setRetention', retention),
  getPosts: async (): Promise<Array<Post>> => ipcRenderer.invoke('repository:post:findAll'),
  readPost: async (url: string | string[]) => ipcRenderer.invoke('repository:post:read', url),
  markPost: async (url: string) => ipcRenderer.invoke('repository:post:mark', url),
  unmarkPost: async (url: string) => ipcRenderer.invoke('repository:post:unmark', url),
  setOnNavigateAction: (callback: (path: string) => void) => { ipcRenderer.on('navigate', (_event, value) => callback(value)); },
  deletePost: (url: string | string[]) => ipcRenderer.invoke('repository:post:delete', url),
};

export type UtilContextApi = typeof utilContext;

export default utilContext;
