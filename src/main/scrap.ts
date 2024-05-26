import { net } from 'electron';
import { extractPosts } from '@src/types';
import postRepository from '@main/repositories/PostRepository';
import { setting } from '@main/app';
import { v4 as uuid } from 'uuid';

const MINUTE = 60 * 1000;
const DAY = MINUTE * 60 * 24;

export function scrapPeriodically() {
  let lastRunTime: number = 0;
  setInterval(async () => {
    if (Date.now() - lastRunTime >= setting.pollingInterval * MINUTE) {
      lastRunTime = Date.now();
      const workId = uuid();
      console.log(`> ${workId} Polling started`);

      for (const site of setting.sites) {
        console.log(`> ${workId} Polling site ${site.url}`);

        try {
          const response = await net.fetch(site.url, { method: 'GET', headers: { 'Content-Type': 'text/html' } });
          const posts = extractPosts(await response.text(), site);
          if (posts.length) await postRepository.insert(posts.map(post => ({ ...post, site: site.id })));
          console.log(`    Stored ${posts.length} posts`);
        } catch (error) {
          console.error(`    Failed to fetch data for site:`, error);
        }
      }
    }
  }, 1000);
}

export function removeOldPostsPeriodically() {
  setInterval(async () => {
    await postRepository.removeOld(setting.retention * DAY);
  }, 10 * MINUTE);
}
