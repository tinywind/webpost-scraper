import React, { useEffect, ReactNode } from 'react';
import ListPage from '@pages/list';
import SettingsPage from '@pages/settings';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(
  [
    { paths: ['', '/', '/list', '/app_window'], element: <ListPage /> },
    { paths: '/settings', element: <SettingsPage /> },
  ]
    .map(({ paths, element }) =>
      (Array.isArray(paths) ? paths : [paths]).map(path => ({
        path,
        element: element,
        errorElement: () => {
          useEffect(() => {
            router.navigate('/list');
          }, []);
          return <></>;
        },
      })),
    )
    .flat() as { path: string }[],
);

export default router;
