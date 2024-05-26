import { net, Notification, BrowserWindow, ipcMain } from 'electron';
import { extractPosts, Site } from '@src/types';
import postRepository from '@main/repositories/PostRepository';
import { setting } from '@main/app';
import { v4 as uuid } from 'uuid';
import { getAppWindow } from '@main/appWindow';

const MINUTE = 60 * 1000;
const DAY = MINUTE * 60 * 24;

export function scrapPeriodically() {
  let lastRunTime: number = 0;
  setInterval(async () => {
    if (Date.now() - lastRunTime >= setting.pollingInterval * MINUTE) {
      lastRunTime = Date.now();

      const workId = uuid();
      console.log(`> ${workId} Polling started`);

      const result: { site: Site; inserted: number }[] = [];
      for (const site of setting.sites) {
        console.log(`> ${workId} Polling site ${site.url}`);

        try {
          const response = await net.fetch(site.url, { method: 'GET', headers: { 'Content-Type': 'text/html' } });
          const posts = extractPosts(await response.text(), site);
          if (posts.length) {
            const r = { site, inserted: (await postRepository.insert(posts.map(post => ({ ...post, site: site.id })))).length };
            result.push(r);
            console.log(`    Stored ${r.inserted} posts`);
          }
        } catch (error) {
          console.error(`    Failed to fetch data for site:`, error);
        }
      }

      const totalInserted = result.reduce((acc, { inserted }) => acc + inserted, 0);
      if (totalInserted) {
        new Notification({
          title: 'New Posts',
          body: `Found ${totalInserted} new posts`,
        })
          .on('click', () => {
            const notification = new Notification({ title: 'New Posts', body: `Found ${totalInserted} new posts` });
            notification.show();
            notification.on('click', () => getAppWindow().webContents.send('navigate', '/list'));
          })
          .show();
      }
    }
  }, 5000);
}

export function removeOldPostsPeriodically() {
  setInterval(async () => {
    await postRepository.removeOld(setting.retention * DAY);
  }, 10 * MINUTE);
}
