import { ipcRenderer } from 'electron';
import { FetchResult } from '@main/window/utilIpc';

const utilContext = {
  fetchSiteData: async (url: string): Promise<FetchResult> => {
    return await ipcRenderer.invoke('fetch-site-data', url);
  },
};

export type UtilContextApi = typeof utilContext;

export default utilContext;
