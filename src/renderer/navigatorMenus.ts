export type MenuItem = {
  name: string;
  action?: string | ((value?: string | number) => unknown);
  shortcut?: string | { label: string; ctrl?: boolean; alt?: boolean; shift?: boolean; key: string };
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
      { name: 'List', action: 'navigate', value: '/list', shortcut: { label: 'Ctrl+1', ctrl: true, key: '1' } },
      { name: 'Settings', action: 'navigate', value: '/settings', shortcut: { label: 'Ctrl+2', ctrl: true, key: '2' } },
    ],
  },
  {
    name: 'Theme',
    items: [
      { name: 'Light', action: 'setTheme', value: 'light' },
      { name: 'Dark', action: 'setTheme', value: 'dark' },
      { name: '__', action: null },
      { name: 'System', action: 'setTheme', value: 'system' },
    ],
  },
  {
    name: 'Credits',
    items: [{ name: 'tinywind', action: 'openUrl', value: 'https://github.com/tinywind', shortcut: '@tinywind' }],
  },
];

if (process.env.NODE_ENV === 'development') {
  navigatorMenus.push({
    name: 'Dev',
    items: [{ name: 'Toggle Developer Tools', action: 'toggleDevtools', shortcut: { label: 'F12', ctrl: false, alt: false, shift: false, key: 'F12' } }],
  });
}

export default navigatorMenus;
