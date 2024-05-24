import React, { useEffect, useState } from 'react';
import { Post, Selector, Site } from '@renderer/types';
import { load } from 'cheerio';
import util from '@main/window/utilContextApi';
import moment from 'moment';
import AppModal from '@components/AppModal';
import navigator from '@main/window/navigatorContextApi';

export type Data = Site & { html?: string };
const DEFAULT_PROPERTY = 'textContent';

export default function SiteModal({ closeModal, data }: { closeModal: () => void; data: Data }) {
  const [selectors, setSelectors] = useState<{
    article: Selector;
    title: Selector;
    link: Selector;
    date: Selector;
  }>({
    article: { selector: '', property: '', regex: '' },
    title: { selector: '', property: '', regex: '' },
    link: { selector: '', property: '', regex: '' },
    date: { selector: '', property: '', regex: '' },
  });
  const [previewData, setPreviewData] = useState<Array<Post>>([]);

  useEffect(() => {
    if (!open) return;
    setSelectors({
      article: { selector: '', property: '', regex: '' },
      title: { selector: '', property: '', regex: '' },
      link: { selector: '', property: '', regex: '' },
      date: { selector: '', property: '', regex: '' },
    });
    setPreviewData([]);

    if (process.env.NODE_ENV !== 'development') return;
    setSelectors({
      article: { selector: 'a.item', property: '', regex: '' },
      title: { selector: '.title', property: 'innerText', regex: '' },
      link: { selector: 'a.item', property: 'href', regex: '' },
      date: { selector: '.etc > div:last-child', property: '', regex: '' },
    });
  }, [open]);

  const handleInputChange = (field: 'article' | 'title' | 'link' | 'date', subfield: 'selector' | 'property' | 'regex', value: string) => {
    setSelectors({
      ...selectors,
      [field]: { ...selectors[field], [subfield]: value },
    });
  };

  const fetchPreview = async () => {
    const result = await util.fetchSiteData(data.url);
    const $ = load(result.html);
    setPreviewData(
      $(selectors.article.selector)
        .toArray()
        .map(article => {
          const article$ = load($.html(article));
          const title = article$(selectors.title.selector);
          const url = article$(selectors.link.selector);
          const date = article$(selectors.date.selector);
          const titleProp = title.prop(selectors.title.property || DEFAULT_PROPERTY);
          const urlProp = url.prop(selectors.link.property || DEFAULT_PROPERTY);
          const dateProp = date.prop(selectors.date.property || DEFAULT_PROPERTY);
          return {
            site: data,
            title: titleProp?.match(new RegExp(selectors.title.regex))?.[0] || titleProp,
            url: urlProp?.match(new RegExp(selectors.link.regex))?.[0] || urlProp,
            createdAt: dateProp?.match(new RegExp(selectors.date.regex))?.[0] || dateProp,
            read: false,
            marked: false,
          };
        }),
    );
  };

  const apply = () => {
    alert('Apply');
    closeModal();
  };

  const InputFields = (field: 'article' | 'title' | 'link' | 'date', fields: ('selector' | 'property' | 'regex')[]) => (
    <div key={field}>
      <label className='block text-sm font-medium text-gray-700'>{`${field.charAt(0).toUpperCase() + field.slice(1)} Selector`}</label>
      <div className='flex space-x-2 mb-4'>
        {fields.map(subfield => (
          <input
            key={subfield}
            placeholder={subfield.charAt(0).toUpperCase() + subfield.slice(1)}
            value={selectors[field][subfield as 'selector' | 'property' | 'regex']}
            onChange={e => handleInputChange(field, subfield as 'selector' | 'property' | 'regex', e.target.value)}
            className='flex-1 p-1 border border-gray-300 rounded text-sm'
          />
        ))}
      </div>
    </div>
  );

  return (
    <AppModal title={'Setting'} closeModal={closeModal} apply={apply}>
      <label htmlFor='title' className='block text-sm font-medium text-gray-700 flex-1 truncate' title={data.name}>
        Title
      </label>
      <div className='mt-1 mb-4 p-1 border border-gray-300 rounded text-sm flex items-center'>
        {data.favicon && <img src={data.favicon} alt='favicon' className='w-4 h-4 mr-2' />}
        <span className='truncate' title={data.name}>
          {data.name}
        </span>
      </div>
      <label htmlFor='url' className='block text-sm font-medium text-gray-700 flex-1 truncate' title={data.url}>
        URL
      </label>
      <div className='mt-1 mb-4 p-1 border border-gray-300 rounded text-sm flex items-center'>
        <span className='truncate' title={data.url}>
          {data.url}
        </span>
      </div>
      <label htmlFor='html' className='block text-sm font-medium text-gray-700'>
        HTML Content
      </label>
      <textarea
        className='mt-1 mb-4 text-xs block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
      <button onClick={fetchPreview} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm'>
        미리보기
      </button>
      <div className='mt-4 overflow-auto max-h-60'>
        {previewData.map((item, index) => (
          <a
            key={index}
            onClick={() => navigator.open_url(item.url.startsWith('http') ? item.url : new URL(item.url, data.url).href)}
            className='flex items-center mb-2 p-2 border border-gray-200 rounded shadow-sm'
            rel='noreferrer'>
            {item.site.favicon && <img src={item.site.favicon} alt='favicon' className='w-4 h-4 mr-2' />}
            <div className='flex flex-col flex-1'>
              <span className='text-sm font-medium'>{item.title}</span>
              <span className='text-xs text-gray-500'>{moment(item.createdAt).isValid() ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          </a>
        ))}
      </div>
    </AppModal>
  );
}