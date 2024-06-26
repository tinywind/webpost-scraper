import { ipcRenderer } from 'electron';
import { FetchResult } from '@main/window/utilIpc';
import { cloneSite, Setting, Site, Post } from '@src/types';

const utilContext = {
  fetchSiteData: async (url: string): Promise<FetchResult> => await ipcRenderer.invoke('fetch-site-data', url),
  exportSettings: async (setting: Setting) => await ipcRenderer.invoke('export-settings', setting),
  setDarkMode: () => ipcRenderer.invoke('dark-mode:dark'),
  setLightMode: () => ipcRenderer.invoke('dark-mode:light'),
  useSystemMode: () => ipcRenderer.invoke('dark-mode:system'),
  save: async (setting: Setting) => ipcRenderer.invoke('repository:save', setting),
  load: async (): Promise<Setting> => ipcRenderer.invoke('repository:load'),
  insertSite: async (site: Site) => ipcRenderer.invoke('repository:site:insert', cloneSite(site)),
  updateSite: async (site: Site) => ipcRenderer.invoke('repository:site:update', cloneSite(site)),
  deleteSite: async (id: string) => ipcRenderer.invoke('repository:site:delete', id),
  setPollingInterval: async (pollingInterval: number) => ipcRenderer.invoke('repository:attribute:setPollingInterval', pollingInterval),
  setRetention: async (retention: number) => ipcRenderer.invoke('repository:attribute:setRetention', retention),
  getPosts: async (): Promise<Array<Post>> => ipcRenderer.invoke('repository:post:findAll'),
  readPost: async (url: string | string[]) => ipcRenderer.invoke('repository:post:read', url),
  markPost: async (url: string) => ipcRenderer.invoke('repository:post:mark', url),
  unmarkPost: async (url: string) => ipcRenderer.invoke('repository:post:unmark', url),
  setOnNavigateAction: (callback: (path: string) => void) => ipcRenderer.on('navigate', (_event, value) => callback(value)),
  deletePost: (url: string | string[]) => ipcRenderer.invoke('repository:post:delete', url),
};

export type UtilContextApi = typeof utilContext;

export default utilContext;
