import router from '@renderer/router';

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
      {
        name: 'List',
        action: () => router.navigate('/'),
      },
      {
        name: '__',
      },
      {
        name: 'Settings',
        action: () => router.navigate('/settings'),
      },
    ],
  },
  {
    name: 'Credits',
    items: [
      {
        name: 'tinywind',
        action: 'open_url',
        value: 'https://github.com/tinywind',
        shortcut: '@tinywind',
      },
    ],
  },
];

if (process.env.NODE_ENV === 'development') {
  navigatorMenus.push({
    name: 'Dev',
    items: [
      {
        name: 'Toogle Developer Tools',
        action: 'toggle_devtools',
        shortcut: 'Ctrl+Shift+I',
      },
    ],
  });
}

export default navigatorMenus;
