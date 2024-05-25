import router from '@renderer/router';
import store from '@renderer/contexts/store';
import { setDark, setLight, useSystemMode } from '@renderer/contexts/themeSlice';

export type MenuItem = {
  name: string;
  action?: string | ((value?: string | number) => unknown);
  shortcut?: string;
  value?: string | number;
  items?: MenuItem[];
};

export type Menu = {
  name: string;
  items: MenuItem[];
};

const navigatorMenus: Menu[] = [
  {
    name: 'View',
    items: [
      { name: 'List', action: () => router.navigate('/list'), shortcut: 'Ctrl+1' },
      { name: 'Settings', action: () => router.navigate('/settings'), shortcut: 'Ctrl+2' },
    ],
  },
  {
    name: 'Theme',
    items: [
      { name: 'Light', action: () => store.dispatch(setLight()) },
      { name: 'Dark', action: () => store.dispatch(setDark()) },
      { name: '__' },
      { name: 'System', action: () => store.dispatch(useSystemMode()) },
    ],
  },
  {
    name: 'Credits',
    items: [{ name: 'tinywind', action: 'open_url', value: 'https://github.com/tinywind', shortcut: '@tinywind' }],
  },
];

if (process.env.NODE_ENV === 'development') {
  navigatorMenus.push({
    name: 'Dev',
    items: [{ name: 'Toogle Developer Tools', action: 'toggle_devtools', shortcut: 'Ctrl+Shift+I' }],
  });
}

export default navigatorMenus;
