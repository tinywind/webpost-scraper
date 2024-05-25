import { dialog, ipcMain, net, nativeTheme } from 'electron';
import { Setting } from '@src/types';
import siteRepository from '@main/repositories/SiteRepository';
import attributeRepository from '@main/repositories/AttributeRepository';
import { setting } from '@main/app';

export type FetchResult = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Map<string, string>;
  html: string;
};

export const registerUtilIpc = () => {
  ipcMain.handle('fetch-site-data', async (_, url: string): Promise<FetchResult> => {
    function convertHeaderToArray(headers: Headers): Map<string, string> {
      const result = new Map<string, string>();
      for (const [key, value] of headers.entries()) result.set(key, value);
      return result;
    }

    if (!url) throw new Error('Please enter a URL');

    const response = await net.fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'text/html' },
    });

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: convertHeaderToArray(response.headers),
      html: await response.text(),
    };
  });
  ipcMain.handle('export-settings', (event, setting: Setting) => {
    dialog
      .showSaveDialog({
        title: 'Save Settings',
        defaultPath: 'setting.json',
        filters: [{ name: 'JSON', extensions: ['json'] }],
      })
      .then(({ filePath }) => {
        if (filePath) {
          const string = JSON.stringify(setting);
          require('fs').writeFileSync(filePath, string);
        }
      });
  });

  ipcMain.handle('dark-mode:toggle', () => (nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'));
  ipcMain.handle('dark-mode:dark', () => (nativeTheme.themeSource = 'dark'));
  ipcMain.handle('dark-mode:light', () => (nativeTheme.themeSource = 'light'));
  ipcMain.handle('dark-mode:system', () => (nativeTheme.themeSource = 'system'));
  ipcMain.handle('repository:save', async (_, _setting: Setting) => {
    await attributeRepository.save(_setting.pollingInterval, _setting.retention);
    await siteRepository.clear();
    await siteRepository.insert(_setting.sites);

    setting.pollingInterval = _setting.pollingInterval;
    setting.retention = _setting.retention;
    setting.sites = _setting.sites;
  });
  ipcMain.handle('repository:load', async () => {
    const { pollingInterval, retention } = await attributeRepository.get();
    const sites = await siteRepository.findAll();
    return { pollingInterval, retention, sites };
  });
  ipcMain.handle('repository:site:insert', async (_, site) => await siteRepository.insert(site));
  ipcMain.handle('repository:site:update', async (_, site) => await siteRepository.update(site.id, site));
  ipcMain.handle('repository:site:delete', async (_, id) => await siteRepository.delete(id));
  ipcMain.handle('repository:attribute:setPollingInterval', async (_, pollingInterval) => await attributeRepository.setPollingInterval(pollingInterval));
  ipcMain.handle('repository:attribute:setRetention', async (_, retention) => await attributeRepository.setRetention(retention));
};
