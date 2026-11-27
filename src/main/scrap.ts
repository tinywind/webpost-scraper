import { net, Notification } from 'electron';
import { extractPosts } from '@common/extractPosts';
import { webUrl } from '@common/webUrl';
import postRepository from '@main/repositories/PostRepository';
import { setting } from '@main/window/utilIpc';
import { getAppWindow } from '@main/appWindow';

const MINUTE = 60 * 1000;
const DAY = MINUTE * 60 * 24;

export function scrapPeriodically() {
  let lastRunTime = 0;
  let running = false;
  return setInterval(async () => {
    if (running || Date.now() - lastRunTime < setting.pollingInterval * MINUTE) return;
    lastRunTime = Date.now();
    running = true;
    try {
      let inserted = 0;
      for (const site of setting.sites) {
        try {
          const url = webUrl(site.url);
          if (!url) throw new Error('Expected an HTTP or HTTPS site URL');
          const response = await net.fetch(url.href, { signal: AbortSignal.timeout(MINUTE) });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const posts = extractPosts(await response.text(), site);
          if (posts.length) inserted += (await postRepository.insert(posts.map(post => ({ ...post, site: site.id })))).length;
        } catch (error) {
          console.error(`Polling failed for site ${site.id}`, error);
        }
      }

      if (inserted) {
        new Notification({ title: 'New Posts', body: `Found ${inserted} new posts` })
          .on('click', () => {
            const window = getAppWindow();
            if (!window || window.isDestroyed()) return;
            if (window.isMinimized()) window.restore();
            window.show();
            window.focus();
            window.webContents.send('navigate', '/list');
          })
          .show();
      }
    } finally {
      running = false;
    }
  }, 5000);
}

export function removeOldPostsPeriodically() {
  setInterval(async () => {
    await postRepository.removeOld(setting.retention * DAY);
  }, 10 * MINUTE);
}
