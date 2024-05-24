import React, { useEffect } from 'react';
import ListPage from '@pages/List';
import SettingsPage from '@pages/Settings';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@components/Layout';

const ErrorElement = () => {
  useEffect(() => {
    router.navigate('/settings');
  }, []);
  return <></>;
};

const router = createBrowserRouter([
  {
    path: '/app_window',
    element: (
      <Layout>
        <ListPage />
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: '/',
    element: (
      <Layout>
        <ListPage />
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <SettingsPage />
      </Layout>
    ),
    errorElement: <ErrorElement />,
  },
]);

export default router;
