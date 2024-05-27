import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@components/window/WindowFrame';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { RouterProvider } from 'react-router-dom';
import router from '@renderer/router';
import navigator from '@main/window/navigatorContextApi';
import util from '@main/window/utilContextApi';
import navigatorMenus, { Shortcut } from '@renderer/navigatorMenus';

library.add(fas);

createRoot(document.getElementById('app')).render(
  <WindowFrame title='Webpost Scraper' platform='windows'>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </WindowFrame>,
);

function setOnNavigateAction() {
  setTimeout(() => {
    if (!util) return setOnNavigateAction();
    util.setOnNavigateAction(async (path: string) => await router.navigate(path));
  }, 1000);
}
setOnNavigateAction();

function setNavigateAction() {
  setTimeout(() => {
    if (!navigator) return setOnNavigateAction();
    navigator.setNavigateAction(async (path: string) => await router.navigate(path));
  }, 1000);
}
setNavigateAction();

document.addEventListener('keyup', e => {
  const menus = navigatorMenus.flatMap(e => e.items).filter(e => e.shortcut && typeof e.shortcut !== 'string' && e.shortcut.key);
  menus.forEach(menu => {
    const shortcut = menu.shortcut as Shortcut;
    const isCtrlMatch = (shortcut.ctrl && e.ctrlKey) || (!shortcut.ctrl && !e.ctrlKey);
    const isAltMatch = (shortcut.alt && e.altKey) || (!shortcut.alt && !e.altKey);
    const isShiftMatch = (shortcut.shift && e.shiftKey) || (!shortcut.shift && !e.shiftKey);
    const isKeyMatch = shortcut.key === e.key || shortcut.key === e.code;

    if (isCtrlMatch && isAltMatch && isShiftMatch && isKeyMatch) {
      console.log(`Shortcut detected: ${shortcut.label}`);
      if (!menu.action) return;

      if (typeof menu.action === 'string') {
        if (!navigator) return console.log('navigator is not available');
        const c: Record<string, CallableFunction> = navigator;
        if (typeof c[menu.action] === 'function') c[menu.action](menu.value);
      } else {
        menu.action(menu.value);
      }
    }
  });
});
