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
