import React, { useEffect } from 'react';
import Settings from '@components/pages/Settings';
import Layout from '@components/Layout';
import router from '@renderer/router';

export default function Page() {
  useEffect(() => {
    (window as any).electronAPI.onNavigate(async (path: string) => await router.navigate(path));
  }, []);

  return (
    <Layout>
      <Settings />
    </Layout>
  );
}
