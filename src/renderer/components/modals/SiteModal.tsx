import React, { useState } from 'react';
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
  const [previewData, setPreviewData] = useState<Array<PostType>>([]);
  const [loading, setLoading] = useState(false);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      const result = await util.fetchSiteData(data.url);
      console.log(result);

      setPreviewData(
        extractPosts(result.html, {
          ...data,
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
      <label htmlFor='title' className='block text-sm font-medium flex-1 truncate' title={data.name}>
        Title
      </label>
      <div className='mt-1 mb-4 p-1 border rounded text-sm flex items-center'>
        {data.favicon && <img src={data.favicon} alt='favicon' className='w-4 h-4 mr-2' />}
        <span className='truncate' title={data.name}>
          {data.name}
        </span>
      </div>
      <label htmlFor='url' className='block text-sm font-medium flex-1 truncate' title={data.url}>
        URL
      </label>
      <div className='mt-1 mb-4 p-1 border rounded text-sm flex items-center'>
        <span className='truncate' title={data.url}>
          {data.url}
        </span>
      </div>
      <label htmlFor='html' className='block text-sm font-medium'>
        HTML Content
      </label>
      <textarea
        className='mt-1 mb-4 text-xs block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        rows={10}
        readOnly
        value={data.html}
      />
      <hr />
      <div className='mt-4'>
        {InputFields('article', ['selector'])}
        {InputFields('title', ['selector', 'property', 'regex'])}
        {InputFields('link', ['selector', 'property', 'regex'])}
        {InputFields('date', ['selector', 'property', 'regex'])}
      </div>
      <div className='text-center'>
        <button disabled={loading} onClick={fetchPreview} className='w-full button icon'>
          {loading ? <BeatLoader size={6} color='white' /> : <FontAwesomeIcon icon={faEye} />}
        </button>
      </div>
      <div className='mt-4'>
        {previewData.map((item, index) => (
          <Post key={index} post={item} />
        ))}
      </div>
    </AppModal>
  );
}
