import { ipcMain, net } from 'electron';

export type FetchResult = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Map<string, string>;
  html: string;
};

export const registerUtilIpc = () => {
  ipcMain.handle('fetch-site-data', async (event, url: string): Promise<FetchResult> => {
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
};
