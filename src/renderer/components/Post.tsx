import React, { Key } from 'react';
import navigator from '@main/window/navigatorContextApi';
import { Post as PostType } from '@src/types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

export default function Post({ post, index, onClick, toggleMark }: { post: PostType; index?: Key; onClick?: (post: PostType) => unknown; toggleMark?: (post: PostType) => unknown }) {
  return (
    <a
      key={index}
      onClick={async () => {
        await navigator.open_url(post.url);
        onClick?.(post);
      }}
      className='flex items-center mb-2 p-2 border rounded shadow-sm app-bgcolor'
      rel='noreferrer'>
      {post.site.favicon && <img src={post.site.favicon} alt='favicon' className='w-4 h-4 mr-2' />}
      <div className='flex flex-col flex-1'>
        <span className='text-sm font-medium'>{post.title}</span>
        <span className='text-xs opacity-50'>{moment(post.createdAt).isValid() ? moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>

      <FontAwesomeIcon icon={faCheck} className={classNames('p-2', post.read ? 'app-accent-color' : 'input-disabled-color')} />

      <button onClick={event => (event.stopPropagation(), toggleMark?.(post))} className='p-2 hover:opacity-50 active:opacity-50'>
        <FontAwesomeIcon icon={faStar} className={post.marked ? 'app-accent-color' : 'input-disabled-color'} />
      </button>
    </a>
  );
}
