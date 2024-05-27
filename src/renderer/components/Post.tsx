import React, { useEffect, useRef, Key, useContext, Context, createContext, MouseEventHandler } from 'react';
import navigator from '@main/window/navigatorContextApi';
import { Post, Post as PostType } from '@src/types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ActiveTabContext, Tab } from '@components/pages/List';

const Post = React.memo(
  function Post({
    post,
    index,
    onClick,
    onContextMenu,
    toggleMark,
    hiddenContext,
    activeTabContext,
  }: {
    post: PostType;
    index?: Key;
    onClick?: (post: PostType) => unknown;
    onContextMenu?: (e: React.MouseEvent<HTMLElement>, post: Post, activeTab: Tab) => unknown;
    toggleMark?: (post: PostType) => unknown;
    hiddenContext?: Context<{ [key: string]: boolean }>;
    activeTabContext?: Context<Tab>;
  }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const hiddenState = useContext(hiddenContext || createContext<{ [key: string]: boolean }>({}));
    const hidden = hiddenState[post.url];
    const activeTab = useContext(activeTabContext || createContext<Tab>('all'));

    const setHidden = () => {
      if (hidden) ref.current?.classList.add('hidden');
      else ref.current?.classList.remove('hidden');
    };

    useEffect(() => {
      setHidden();
      setTimeout(() => ref.current?.classList.remove('button-hover-bgcolor'), 2000);
    }, []);

    useEffect(() => {
      setHidden();
    }, [hidden]);

    return (
      <a
        ref={ref}
        key={index}
        onClick={async () => {
          await navigator.openUrl(post.url);
          onClick?.(post);
        }}
        onContextMenu={e => onContextMenu?.(e, post, activeTab)}
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
  },
  (prevProps, nextProps) => {
    return prevProps.post === nextProps.post;
  },
);

export default Post;
