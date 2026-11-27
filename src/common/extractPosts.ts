import { load } from 'cheerio';
import moment from 'moment';
import type { Post, Selector, Site } from '../types';
import { webUrl } from './webUrl';

function pattern(selector?: Selector) {
  try {
    return selector?.regex ? new RegExp(selector.regex) : undefined;
  } catch {
    return undefined;
  }
}

export function extractPosts(html: string, site: Site): Post[] {
  if (!site.articleSelector || !site.titleSelector?.selector || !site.urlSelector?.selector) return [];
  const $ = load(html);
  const titlePattern = pattern(site.titleSelector);
  const urlPattern = pattern(site.urlSelector);
  const datePattern = pattern(site.createdAtSelector);
  const posts: Post[] = [];

  for (const article of $(site.articleSelector).toArray()) {
    const root = $(article);
    const read = (selector: Selector | undefined, property: string, regex?: RegExp) => {
      if (!selector?.selector) return '';
      const element = root.is(selector.selector) ? root : root.find(selector.selector).first();
      const value: unknown = element.prop(selector.property || property);
      if (typeof value !== 'string') return '';
      return (regex?.exec(value)?.[0] || value).trim();
    };

    const title = read(site.titleSelector, 'textContent', titlePattern);
    const link = read(site.urlSelector, 'href', urlPattern);
    const url = webUrl(link, site.url);
    if (!title || !url) continue;
    const date = read(site.createdAtSelector, 'textContent', datePattern);
    const timestamp = date ? moment(date).valueOf() : NaN;
    posts.push({
      site, title, url: /^https?:\/\//.test(link) ? link : url.href,
      createdAt: Number.isFinite(timestamp) ? timestamp : Date.now(),
      read: false, marked: false,
    });
  }
  return posts;
}
