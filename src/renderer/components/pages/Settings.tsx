import React, { useEffect, useState } from 'react';
import { Setting, Site } from '@src/types';
import SiteModal, { Data } from '@components/modals/SiteModal';
import BeatLoader from 'react-spinners/BeatLoader';
import util from '@main/window/utilContextApi';
import { load } from 'cheerio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch, faTrashCan, faUpload, faList } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '@renderer/contexts/store';
import { received } from '@renderer/contexts/settingSlice';
import { error, success, warning } from '@renderer/utils/swals';
import Loader from '@components/Loader';
import router from '@renderer/router';

export default function Settings() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState<Data | null>(null);
  const dispatch = useAppDispatch();
  const { pollingInterval, retention, sites } = useAppSelector(state => state.setting);

  const persist = async (operation: Promise<Setting>) => {
    try {
      dispatch(received(await operation));
      return true;
    } catch (cause) {
      await error(String(cause));
      return false;
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    setUrl('https://gall.dcinside.com/board/lists/?id=leagueoflegends6');
  }, []);

  const loadSiteData = async (url: string, site?: Site) => {
    if (!url) {
      warning('Please enter a URL');
      return;
    }
    try {
      setLoading(true);
      const result = await util.fetchSiteData(url);

      if (result.ok) {
        const $ = load(result.html);
        const title = $('title').text();
        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
        if (favicon) {
          if (favicon.startsWith('//')) favicon = `${url.startsWith('https') ? 'https' : 'http'}:${favicon}`;
          else if (!favicon.startsWith('http')) favicon = `${new URL(url).origin}/${favicon}`;
        }

        if (!site) setSiteData({ id: uuid(), name: title ?? url, url, html: result.html, favicon });
        else setSiteData({ ...site, html: result.html });
      } else {
        error(`Failed to fetch site data: ${result.statusText}`);
      }
    } catch (cause) {
      error('Failed to load the page: ' + String(cause));
    } finally {
      setLoading(false);
    }
  };

  const importSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    try {
      if (await persist(util.save(JSON.parse(await file.text())))) await success('Settings imported');
    } catch (cause) {
      await error(String(cause));
    }
  };

  const SiteItem: React.FC<{ site: Site }> = ({ site }) => {
    return (
      <div key={site.id} className='flex justify-between items-center border-b border-gray-300 p-2 mb-2'>
        {site.favicon && <img src={site.favicon} alt='favicon' className='w-5 h-5 mr-4' />}
        <div className='flex-1 w-3/4'>
          <a onClick={() => loadSiteData(site.url, site)} className='text-md font-medium'>
            {site.name}
          </a>
          <div className='flex items-center text-xs text-gray-500'>
            <span className='truncate'>{site.url}</span>
          </div>
        </div>
        <button onClick={() => persist(util.deleteSite(site.id))} className='button icon'>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className='p-4 relative' style={{ height: 'calc(100% - 2rem)' }}>
        <div className='flex flex-col relative h-full max-w-2xl mx-auto'>
          <div className='flex justify-between items-center mb-2'>
            <h1 className='text-md font-bold text-gray-700'>Scraper Settings</h1>
            <div className='flex gap-2'>
              <button onClick={() => util.exportSettings().catch(cause => error(String(cause)))} className='button icon'>
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <input type='file' onChange={importSettings} className='hidden' id='file-upload' />
              <label htmlFor='file-upload' className='button icon'>
                <FontAwesomeIcon icon={faUpload} />
              </label>
              <button onClick={() => router.navigate('/list')} className='ml-4 button icon'>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
          <div className='flex-grow overflow-auto border-t border-gray-300 mt-4 mb-4 pt-4'>
            <h2 className='text-sm font-bold text-gray-700 mb-2'>Update Interval</h2>
            <div className='flex gap-2 mb-4'>
              {[
                { value: 1, label: '1 min' },
                { value: 5, label: '5 min' },
                { value: 15, label: '15 min' },
                { value: 30, label: '30 min' },
                { value: 60, label: '1 hour' },
                { value: 360, label: '6 hours' },
                { value: 720, label: '12 hours' },
                { value: 1440, label: '1 day' },
              ].map((e, index) => (
                <button
                  key={index}
                  onClick={() => persist(util.setPollingInterval(e.value))}
                  className={`button ${pollingInterval === e.value ? 'active' : ''}`}>
                  {e.label}
                </button>
              ))}
            </div>
            <h2 className='text-sm font-bold text-gray-700 mb-2'>Retention Period</h2>
            <div className='flex gap-2'>
              {[
                { value: 1, label: '1 day' },
                { value: 3, label: '3 days' },
                { value: 7, label: '7 days' },
                { value: 14, label: '14 days' },
              ].map((e, index) => (
                <button key={index} onClick={() => persist(util.setRetention(e.value))} className={`button ${retention === e.value ? 'active' : ''}`}>
                  {e.label}
                </button>
              ))}
            </div>

            <div className='flex gap-1 border-t border-gray-300 mt-4 mb-4 pt-4'>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder='Enter website URL to crawl' className='flex-1 p-1 border rounded text-sm' />
              <button disabled={loading} onClick={() => loadSiteData(url)} className='button icon'>
                {loading ? <BeatLoader size={6} color='white' /> : <FontAwesomeIcon icon={faSearch} />}
              </button>
            </div>
            {sites.map(site => (
              <SiteItem key={site.id} site={site} />
            ))}
          </div>
        </div>
      </div>
      {siteData && (
        <SiteModal
          closeModal={() => setSiteData(null)}
          data={siteData}
          addSite={site => persist(sites.some(s => s.id === site.id) ? util.updateSite(site) : util.insertSite(site))}
        />
      )}
      {loading && <Loader />}
    </>
  );
}
