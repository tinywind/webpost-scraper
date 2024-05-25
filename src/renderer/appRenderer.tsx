import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@components/window/WindowFrame';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { RouterProvider } from 'react-router-dom';
import router from '@renderer/router';

library.add(fas);

createRoot(document.getElementById('app')).render(
  <WindowFrame title='Webpost Scraper' platform='windows'>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </WindowFrame>,
);
