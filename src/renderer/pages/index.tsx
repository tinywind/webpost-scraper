import React from 'react';
import Layout from '@components/Layout';
import CrawlerSettings from '@pages/CrawlerSettings';
import { v4 as uuid } from 'uuid';

export default function Page() {
  return (
    <Layout>
      <CrawlerSettings
        sites={[
          {
            id: uuid(),
            name: 'Google',
            url: 'https://google.com',
            favicon: 'https://www.google.com/favicon.ico',
            titleSelector: {
              selector: 'body > main > article > div > section:nth-of-type(2) > div > a',
              property: 'innerText',
            },
            urlSelector: {
              selector: 'body > main > article > div > section:nth-of-type(2) > div > a',
              property: 'href',
            },
          },
          {
            id: uuid(),
            name: 'Yahoo',
            url: 'https://yahoo.com',
            favicon: 'https://www.yahoo.com/favicon.ico',
            titleSelector: {
              selector: 'body > main > article > div > section:nth-of-type(2) > div > a',
              property: 'innerText',
            },
            urlSelector: {
              selector: 'body > main > article > div > section:nth-of-type(2) > div > a',
              property: 'href',
            },
          },
        ]}
      />
    </Layout>
  );
}
