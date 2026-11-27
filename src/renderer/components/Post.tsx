import React, { useEffect, useRef } from 'react';
import navigator from '@main/window/navigatorContextApi';
import type { Post as PostType } from '@src/types';
import { error } from '@renderer/utils/swals';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const Post = React.memo(function Post({ post, onClick, onContextMenu, toggleMark }: {
  post: PostType;
  onClick?: (post: PostType) => unknown;
  onContextMenu?: (url: string) => void;
  toggleMark?: (post: PostType) => unknown;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => ref.current?.classList.remove('button-hover-bgcolor'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      ref={ref}
      onClick={async () => {
        try {
          await navigator.openUrl(post.url);
          await onClick?.(post);
        } catch (cause) {
          await error(String(cause));
        }
      }}
      onContextMenu={() => onContextMenu?.(post.url)}
      className={classNames('flex items-center mb-2 p-2 border rounded shadow-sm app-bgcolor hover:shadow-md transition-colors duration-200 button-hover-bgcolor')}
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
});

export default Post;
