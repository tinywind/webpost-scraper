import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Post as PostType } from '@src/types';
import Post from '@components/Post';
import router from '@renderer/router';
import { ContextMenu } from 'primereact/contextmenu';
import util from '@main/window/utilContextApi';

export default function List() {
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'marked'>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<PostType[]>([]);
  const cm = useRef<ContextMenu>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const intervalId = setInterval(async () => setItems(await util.getPosts()), 10 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const toggleMark = async (post: PostType) => {
    post.marked ? await util.unmarkPost(post.url) : await util.markPost(post.url);
    post.marked = !post.marked;
    setItems([...items]);
  };

  const setRead = async (post: PostType) => {
    await util.readPost(post.url);
    post.read = true;
    setItems([...items]);
  };

  const readAll = async () => {
    await util.readPost(items.map(item => item.url));
    items.forEach(item => (item.read = true));
    setItems([...items]);
  };

  return (
    <>
      <ContextMenu model={[{ label: 'Clear', icon: 'pi pi-check', command: readAll }]} ref={cm} breakpoint='767px' />
      <div className='p-4 relative' style={{ height: 'calc(100% - 2rem)' }}>
        <div className='flex flex-col relative h-full max-w-2xl mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <div className='text-lg font-bold'>
              <button className={`button px-3 py-2 ${activeTab === 'unread' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('unread')}>
                읽지 않음 ({items.filter(item => !item.read).length})
              </button>
              <button className={`button px-3 py-2 ${activeTab === 'all' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('all')}>
                전체 ({items.length})
              </button>
              <button className={`button px-3 py-2 ${activeTab === 'marked' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('marked')}>
                marked ({items.filter(item => item.marked).length})
              </button>
            </div>
            <div className='flex items-center space-x-4'>
              <div>
                <input ref={input} placeholder='Search' className='py-1 px-3 border rounded text-sm' onKeyDown={e => e.key === 'Enter' && setSearchQuery(e.currentTarget.value)} />
                <button className='button icon' onClick={() => setSearchQuery(input.current.value)}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <button className='button icon' onClick={() => router.navigate('/settings')}>
                <FontAwesomeIcon icon={faCog} />
              </button>
            </div>
          </div>
          <div className='flex-grow overflow-auto border-t border-gray-300 mt-4 mb-4 pt-4' onContextMenu={e => activeTab === 'unread' && cm.current.show(e)}>
            {items
              .filter(item => {
                if (activeTab === 'unread') return !item.read;
                if (activeTab === 'marked') return item.marked;
                return true;
              })
              .filter(item => item.title.includes(searchQuery))
              .map((item, index) => (
                <Post key={index} post={item} index={index} onClick={setRead} toggleMark={toggleMark} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
