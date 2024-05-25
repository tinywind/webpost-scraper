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
  createdAt: Date;
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
