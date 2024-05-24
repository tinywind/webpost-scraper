import React, { useState, useEffect } from 'react';
import { Site } from '../types';
import CrawlerModal, { Data } from '@renderer/modals/CrawlerModal';
import BeatLoader from 'react-spinners/BeatLoader';
import util from '@main/window/utilContextApi';
import { load } from 'cheerio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';

const CrawlerSettings: React.FC<{ sites: Site[] }> = ({ sites }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [siteData, setSiteData] = useState<Data | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    setUrl('https://1bang.kr/ticket-deal');
  }, []);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const fetchSiteData = async () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    setIsLoading(true);
    try {
      const result = await util.fetchSiteData(url);

      if (result.ok) {
        const $ = load(result.html);
        const title = $('title').text();
        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
        if (favicon && !favicon.startsWith('http')) {
          const urlObject = new URL(url);
          favicon = `${urlObject.origin}/${favicon}`;
        }
        setSiteData({ id: uuid(), name: title ?? url, url, html: result.html, favicon });
        setOpenModal(true);
      } else {
        alert(`Failed to fetch site data: ${result.statusText}`);
      }
    } catch (error) {
      alert('Failed to load the page: ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className='p-4 min-h-screen'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-md font-bold text-gray-700 mb-2'>Crawler Settings</h1>
          <div className='flex gap-1 mb-2'>
            <input type='text' value={url} onChange={handleUrlChange} placeholder='Enter website URL to crawl' className='flex-1 p-1 border border-gray-300 rounded text-sm' />
            <button onClick={fetchSiteData} className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm min-w-0'>
              {isLoading ? <BeatLoader size={6} color='white' /> : <FontAwesomeIcon icon={faSearch} />}
            </button>
          </div>
          {sites.map((site, index) => (
            <SiteItem key={index} site={site} />
          ))}
        </div>
      </div>
      {siteData && <CrawlerModal open={openModal} closeModal={() => setOpenModal(false)} data={siteData} />}
    </>
  );
};

const SiteItem: React.FC<{ site: Site }> = ({ site }) => {
  return (
    <div key={site.id} className='flex justify-between items-center border-b border-gray-300 p-2 mb-2'>
      <div className='flex-1 w-3/4'>
        <span className='text-md font-medium'>{site.name}</span>
        <div className='flex items-center text-xs text-gray-500'>
          {site.favicon && <img src={site.favicon} alt='favicon' className='w-4 h-4 mr-1' />}
          <span className='truncate'>{site.url}</span>
        </div>
      </div>
      <button className='min-w-0 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm'>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};

export default CrawlerSettings;
