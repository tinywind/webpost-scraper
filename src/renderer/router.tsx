import React, { useEffect } from 'react';
import ListPage from '@pages/list';
import SettingsPage from '@pages/settings';
import { createBrowserRouter } from 'react-router-dom';

const ErrorElement = () => {
  useEffect(() => {
    router.navigate('/list');
  }, []);
  return <></>;
};

const router = createBrowserRouter([
  {
    path: '/app_window',
    element: <ListPage />,
    errorElement: <ErrorElement />,
  },
  {
    path: '',
    element: <ListPage />,
    errorElement: <ErrorElement />,
  },
  {
    path: '/',
    element: <ListPage />,
    errorElement: <ErrorElement />,
  },
  {
    path: '/list',
    element: <ListPage />,
    errorElement: <ErrorElement />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    errorElement: <ErrorElement />,
  },
]);

export default router;
