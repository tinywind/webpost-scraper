import React, { useEffect, useState } from 'react';
import { cloneSite, Site } from '@src/types';
import SiteModal, { Data } from '@components/modals/SiteModal';
import BeatLoader from 'react-spinners/BeatLoader';
import util from '@main/window/utilContextApi';
import { load } from 'cheerio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '@renderer/contexts/store';
import { setPollingInterval, setRetention, save, addSite, deleteSite, updateSite } from '@renderer/contexts/settingSlice';
import { error, success, warning } from '@renderer/utils/swals';
import Loader from '@components/Loader';

export default function Settings() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteData, setSiteData] = useState<Data | null>(null);
  const [pollingIntervalState, setPollingIntervalState] = useState(5);
  const [retentionState, setRetentionState] = useState(3);
  const dispatch = useAppDispatch();
  const settingState = useAppSelector(state => state.setting);

  useEffect(() => {
    settingState.setting.pollingInterval && setPollingIntervalState(settingState.setting.pollingInterval);
    settingState.setting.retention && setRetentionState(settingState.setting.retention);
    settingState.setting.sites && setSites(settingState.setting.sites.map(site => cloneSite(site)));

    if (process.env.NODE_ENV !== 'development') return;
    setUrl('https://1bang.kr/ticket-deal');
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
        if (favicon && !favicon.startsWith('http')) {
          const urlObject = new URL(url);
          favicon = `${urlObject.origin}/${favicon}`;
        }

        if (!site) setSiteData({ id: uuid(), name: title ?? url, url, html: result.html, favicon });
        else setSiteData({ ...site, html: result.html });
      } else {
        error(`Failed to fetch site data: ${result.statusText}`);
      }
    } catch (error) {
      error('Failed to load the page: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportSettings = () => util.exportSettings({ pollingInterval: pollingIntervalState, retention: retentionState, sites: sites.map(site => cloneSite(site)) });
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const setting = JSON.parse(reader.result as string) as {
          pollingInterval: number;
          retention: number;
          sites: Site[];
        };
        if (setting.pollingInterval && setting.retention && setting.sites) {
          setPollingIntervalState(setting.pollingInterval);
          setRetentionState(setting.retention);
          setSites(setting.sites);
          dispatch(save({ setting }));
          success('Settings imported');
        }
      };
      reader.readAsText(file);
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
        <button onClick={() => (setSites(sites.filter(s => s.id !== site.id)), dispatch(deleteSite({ id: site.id })))} className='button icon'>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className='p-4 min-h-screen'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex justify-between items-center mb-2'>
            <h1 className='text-md font-bold text-gray-700'>Crawler Settings</h1>
            <div className='flex gap-2'>
              <button onClick={exportSettings} className='button icon'>
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <input type='file' onChange={importSettings} className='hidden' id='file-upload' />
              <label htmlFor='file-upload' className='button icon'>
                <FontAwesomeIcon icon={faUpload} />
              </label>
            </div>
          </div>
          <div className='border-t border-gray-300 mt-4 mb-4 pt-4'>
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
                  onClick={() => (setPollingIntervalState(e.value), dispatch(setPollingInterval({ pollingInterval: e.value })))}
                  className={`button ${pollingIntervalState === e.value ? 'active' : ''}`}>
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
                <button key={index} onClick={() => (setRetentionState(e.value), dispatch(setRetention({ retention: e.value })))} className={`button ${retentionState === e.value ? 'active' : ''}`}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className='flex gap-1 border-t border-gray-300 mt-4 mb-4 pt-4'>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder='Enter website URL to crawl' className='flex-1 p-1 border border-gray-300 rounded text-sm' />
            <button disabled={loading} onClick={() => loadSiteData(url)} className='button'>
              {loading ? <BeatLoader size={6} color='white' /> : <FontAwesomeIcon icon={faSearch} />}
            </button>
          </div>
          {sites.map((site, index) => (
            <SiteItem key={index} site={site} />
          ))}
        </div>
      </div>
      {siteData && (
        <SiteModal
          closeModal={() => setSiteData(null)}
          data={siteData}
          addSite={(site: Site) => {
            if (sites.find(s => s.id === site.id)) {
              setSites(sites.map(s => (s.id === site.id ? site : s)));
              dispatch(updateSite({ id: site.id, site }));
            } else {
              setSites([...sites, site]);
              dispatch(addSite({ site }));
            }
          }}
        />
      )}
      {loading && <Loader />}
    </>
  );
}
