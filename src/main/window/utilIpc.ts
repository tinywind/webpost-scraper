import { dialog, ipcMain, nativeTheme, net } from 'electron';
import { writeFile } from 'node:fs/promises';
import type { Post, Selector, Setting, Site } from '@src/types';
import { webUrl } from '@common/webUrl';
import attributeRepository from '@main/repositories/AttributeRepository';
import postRepository from '@main/repositories/PostRepository';

export type FetchResult = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Map<string, string>;
  html: string;
};

export const setting: Setting = { theme: 'system', pollingInterval: 5, retention: 3, sites: [] };

function validInterval(value: number) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error('Expected a positive whole number');
  return value;
}

function cleanSelector(value?: Selector) {
  if (value == null) return;
  if (typeof value.selector !== 'string' || (value.property != null && typeof value.property !== 'string') ||
      (value.regex != null && typeof value.regex !== 'string')) throw new Error('Invalid site selector');
  return { selector: value.selector, property: value.property || '', regex: value.regex };
}

function cleanSite(site: Site): Site {
  if (!site || typeof site.id !== 'string' || !site.id || typeof site.name !== 'string' || !webUrl(site.url) ||
      (site.favicon != null && typeof site.favicon !== 'string') ||
      (site.articleSelector != null && typeof site.articleSelector !== 'string')) throw new Error('Invalid website configuration');
  return {
    id: site.id, name: site.name, url: site.url, favicon: site.favicon, articleSelector: site.articleSelector,
    titleSelector: cleanSelector(site.titleSelector), urlSelector: cleanSelector(site.urlSelector), createdAtSelector: cleanSelector(site.createdAtSelector),
  };
}

export const registerUtilIpc = () => {
  let pending = Promise.resolve();
  function change(update: () => Setting) {
    const operation = pending.then(async () => {
      const next = update();
      await attributeRepository.save(next);
      Object.assign(setting, next);
      nativeTheme.themeSource = next.theme;
      return next;
    });
    pending = operation.then(() => {}, () => {});
    return operation;
  }

  ipcMain.handle('fetch-site-data', async (_, value: string): Promise<FetchResult> => {
    if (!value) throw new Error('Please enter a URL');
    const url = webUrl(value);
    if (!url) throw new Error('Expected an HTTP or HTTPS URL');
    const response = await net.fetch(url.href);
    return {
      ok: response.ok, status: response.status, statusText: response.statusText,
      headers: new Map(response.headers.entries()), html: await response.text(),
    };
  });
  ipcMain.handle('export-settings', async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Settings', defaultPath: 'setting.json', filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (filePath) await writeFile(filePath, JSON.stringify(setting));
  });

  ipcMain.handle('dark-mode:toggle', () => change(() => ({ ...setting, theme: nativeTheme.shouldUseDarkColors ? 'light' : 'dark' })));
  for (const theme of ['dark', 'light', 'system'] as const) {
    ipcMain.handle(`dark-mode:${theme}`, () => change(() => ({ ...setting, theme })));
  }
  ipcMain.handle('repository:save', (_, value: Setting) => change(() => {
    if (!value || !['dark', 'light', 'system'].includes(value.theme) || !Array.isArray(value.sites)) throw new Error('Invalid settings');
    const sites = value.sites.map(cleanSite);
    if (new Set(sites.map(site => site.id)).size !== sites.length) throw new Error('Duplicate site ID');
    return { theme: value.theme, pollingInterval: validInterval(value.pollingInterval), retention: validInterval(value.retention), sites };
  }));
  ipcMain.handle('repository:load', async () => { await pending; return setting; });
  ipcMain.handle('repository:site:insert', (_, site: Site) => change(() => {
    if (setting.sites.some(s => s.id === site.id)) throw new Error('Site already exists');
    return { ...setting, sites: [...setting.sites, cleanSite(site)] };
  }));
  ipcMain.handle('repository:site:update', (_, site: Site) => change(() => {
    if (!setting.sites.some(s => s.id === site.id)) throw new Error('Site no longer exists');
    return { ...setting, sites: setting.sites.map(s => s.id === site.id ? cleanSite(site) : s) };
  }));
  ipcMain.handle('repository:site:delete', (_, id: string) => change(() => ({ ...setting, sites: setting.sites.filter(s => s.id !== id) })));
  ipcMain.handle('repository:attribute:setPollingInterval', (_, value: number) => change(() => ({ ...setting, pollingInterval: validInterval(value) })));
  ipcMain.handle('repository:attribute:setRetention', (_, value: number) => change(() => ({ ...setting, retention: validInterval(value) })));
  ipcMain.handle('repository:post:findAll', async (): Promise<Post[]> => {
    const sites = new Map(setting.sites.map(site => [site.id, site]));
    const posts = await postRepository.findAll();
    return posts.flatMap(post => {
      const site = sites.get(post.site);
      return site ? [{ ...post, site }] : [];
    });
  });
  ipcMain.handle('repository:post:read', (_, url: string | string[]) => postRepository.read(url));
  ipcMain.handle('repository:post:mark', (_, url: string) => postRepository.mark(url));
  ipcMain.handle('repository:post:unmark', (_, url: string) => postRepository.unmark(url));
  ipcMain.handle('repository:post:delete', (_, url: string | string[]) => postRepository.delete(url));
};
