import React, { useState } from 'react';
import { load } from 'cheerio';
import { Post as PostType, extractPosts, Selector, Site } from '@src/types';
import util from '@main/window/utilContextApi';
import AppModal from '@components/AppModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import BeatLoader from 'react-spinners/BeatLoader';
import Post from '@components/Post';

export type Data = Site & { html?: string };

export default function SiteModal({ closeModal, data, addSite }: { closeModal: () => void; data: Data; addSite: (site: Site) => void }) {
  const [selectors, setSelectors] = useState<{
    article: Selector;
    title: Selector;
    link: Selector;
    date: Selector;
  }>({
    article: { selector: data.articleSelector || '', property: '', regex: '' },
    title: { selector: data.titleSelector?.selector || '', property: data.titleSelector?.property || '', regex: data.titleSelector?.regex || '' },
    link: { selector: data.urlSelector?.selector || '', property: data.urlSelector?.property || '', regex: data.urlSelector?.regex || '' },
    date: { selector: data.createdAtSelector?.selector || '', property: data.createdAtSelector?.property || '', regex: data.createdAtSelector?.regex || '' },
  });
  const [name, setName] = useState(data.name);
  const [favicon, setFavicon] = useState(data.favicon);
  const [url, setUrl] = useState(data.url);
  const [html, setHtml] = useState(data.html);
  const [previewData, setPreviewData] = useState<Array<PostType>>([]);
  const [loading, setLoading] = useState(false);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      const result = await util.fetchSiteData(url);
      setHtml(result.html);

      const $ = load(result.html);
      let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
      if (favicon) {
        if (favicon.startsWith('//')) favicon = `${url.startsWith('https') ? 'https' : 'http'}:${favicon}`;
        else if (!favicon.startsWith('http')) favicon = `${new URL(url).origin}/${favicon}`;
      }

      setFavicon(favicon);
      setPreviewData(
        extractPosts(result.html, {
          ...data,
          name,
          favicon,
          url,
          articleSelector: selectors.article.selector,
          titleSelector: selectors.title,
          urlSelector: selectors.link,
          createdAtSelector: selectors.date,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    addSite({
      ...data,
      name,
      favicon,
      url,
      articleSelector: selectors.article.selector,
      titleSelector: selectors.title,
      urlSelector: selectors.link,
      createdAtSelector: selectors.date,
    });
    closeModal();
  };

  const InputFields = (field: 'article' | 'title' | 'link' | 'date', fields: ('selector' | 'property' | 'regex')[]) => (
    <div key={field}>
      <label className='block text-sm font-medium'>{`${field.charAt(0).toUpperCase() + field.slice(1)} Selector`}</label>
      <div className='flex space-x-2 mb-4'>
        {fields.map(subfield => (
          <input
            key={subfield}
            placeholder={subfield.charAt(0).toUpperCase() + subfield.slice(1)}
            value={selectors[field][subfield as 'selector' | 'property' | 'regex']}
            onChange={e => setSelectors({ ...selectors, [field]: { ...selectors[field], [subfield]: e.target.value } })}
            className='flex-1 p-1 border rounded text-sm'
          />
        ))}
      </div>
    </div>
  );

  return (
    <AppModal title={'Site'} closeModal={closeModal} apply={apply}>
      <label htmlFor='title' className='block text-sm font-medium flex-1 truncate' title={name}>
        Title
      </label>
      <div className='mt-1 mb-4 px-1 border rounded flex items-center w-full input-bgcolor'>
        {favicon && <img src={favicon} alt='favicon' className='w-4 h-4 mr-2' />}
        <input className='p-1 border-none text-sm w-full' value={name} onChange={e => setName(e.target.value)} />
      </div>

      <label htmlFor='url' className='block text-sm font-medium flex-1 truncate' title={url}>
        URL
      </label>
      <div className='flex gap-1 border-t border-gray-300 mt-4 mb-4 pt-4'>
        <input className='flex-1 p-1 border rounded text-sm' value={url} onChange={e => setUrl(e.target.value)} />
        <button disabled={loading} onClick={fetchPreview} className='button icon'>
          {loading ? <BeatLoader size={6} color='white' /> : <FontAwesomeIcon icon={faEye} />}
        </button>
      </div>
      <label htmlFor='html' className='block text-sm font-medium'>
        HTML Content
      </label>
      <textarea className='mt-1 mb-4 text-xs block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' rows={10} defaultValue={html} />
      <hr />
      <div className='mt-4'>
        {InputFields('article', ['selector'])}
        {InputFields('title', ['selector', 'property', 'regex'])}
        {InputFields('link', ['selector', 'property', 'regex'])}
        {InputFields('date', ['selector', 'property', 'regex'])}
      </div>

      <div className='mt-4 border-t pt-4'>
        {previewData.map((item, index) => (
          <Post key={index} post={item} />
        ))}
      </div>
    </AppModal>
  );
}
