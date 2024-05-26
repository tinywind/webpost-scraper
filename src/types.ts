import { load } from 'cheerio';
import moment from 'moment';

export type Setting = {
  pollingInterval: number;
  retention: number;
  sites: Site[];
};

export type Site = {
  id: string; // uuid
  name: string;
  url: string;
  favicon?: string;
  articleSelector?: string;
  titleSelector?: Selector;
  urlSelector?: Selector;
  createdAtSelector?: Selector;
};

export type Post = {
  site: Site;
  title: string;
  url: string;
  createdAt: number; // unix timestamp
  read: boolean;
  marked: boolean;
};

export type Selector = {
  selector: string; // CSS selector (ex: body > main > article > div > section:nth-of-type(2) > div > a)
  property: string; // dom property (ex: href, src, innerText, textContent) refer to: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
  regex?: string; // regex to apply to the property
};

export const cloneSite = (site: Site) => ({
  id: site.id,
  name: site.name,
  url: site.url,
  favicon: site.favicon,
  articleSelector: site.articleSelector,
  titleSelector: {
    selector: site.titleSelector.selector,
    property: site.titleSelector.property,
    regex: site.titleSelector.regex,
  },
  urlSelector: {
    selector: site.urlSelector.selector,
    property: site.urlSelector.property,
    regex: site.urlSelector.regex,
  },
  createdAtSelector: {
    selector: site.createdAtSelector.selector,
    property: site.createdAtSelector.property,
    regex: site.createdAtSelector.regex,
  },
});

export const extractPosts = (html: string, site: Site): Post[] => {
  const $ = load(html);
  return $(site.articleSelector)
    .toArray()
    .map(article => {
      const article$ = load($.html(article));
      const titleEl = article$(site.titleSelector.selector);
      const urlEl = article$(site.urlSelector.selector);
      const dateEl = site.createdAtSelector.selector ? article$(site.createdAtSelector.selector) : null;
      const titleProp = titleEl.prop(site.titleSelector.property || 'textContent') || '';
      const urlProp = urlEl.prop(site.urlSelector.property || 'href') || '';
      const dateProp = dateEl ? dateEl.prop(site.createdAtSelector.property || 'textContent') || '' : '';
      let date = new Date();
      try {
        date = moment(dateProp?.match(new RegExp(site.createdAtSelector.regex))?.[0] || dateProp).toDate();
      } catch (ignored) {
        ('');
      }
      const title = titleProp?.match(new RegExp(site.titleSelector.regex))?.[0] || titleProp;
      const url = urlProp?.match(new RegExp(site.urlSelector.regex))?.[0] || urlProp;
      const createdAt = date.getTime();
      return {
        site,
        title: title.trim(),
        url: url.startsWith('http://') || url.startsWith('https://') ? url : url.startsWith('//') ? `${site.url.startsWith('https') ? 'https' : 'http'}:${url}` : new URL(url, site.url).href,
        createdAt: isNaN(createdAt) || !createdAt ? Date.now() : createdAt,
        read: false,
        marked: false,
      };
    })
    .filter(post => post && post.title && post.url && post.createdAt);
};
