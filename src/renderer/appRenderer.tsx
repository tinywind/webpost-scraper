import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Page from '@pages/index';

createRoot(document.getElementById('app')).render(
  <WindowFrame title='Webpost Scraper' platform='windows'>
    <Page />
  </WindowFrame>,
);
