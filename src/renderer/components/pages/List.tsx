import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { posts } from '@components/pages/testdata';
import { Post as PostType } from '@src/types';
import Post from '@components/Post';
import router from '@renderer/router';
import { ContextMenu } from 'primereact/contextmenu';

export default function List() {
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'marked'>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<PostType[]>([]);
  const cm = useRef<ContextMenu>(null);

  useEffect(() => {
    setItems(posts);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.currentTarget.value);
    }
  };

  const toggleMark = (post: PostType) => {
    post.marked = !post.marked;
    setItems([...items]);
  };

  const setRead = (post: PostType) => {
    post.read = true;
    setItems([...items]);
  };

  const readAll = () => {
    items.forEach(item => (item.read = true));
    setItems([...items]);
  };

  return (
    <>
      <ContextMenu model={[{ label: 'Clear', icon: 'pi pi-check', command: readAll }]} ref={cm} breakpoint='767px' />
      <div className='p-4 min-h-screen'>
        <div className='max-w-2xl mx-auto'>
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
                <input type='text' placeholder='Search' className='py-1 px-3 border rounded text-sm' onKeyDown={handleSearch} />
                <button className='button icon'>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <button className='button icon' onClick={() => router.navigate('/settings')}>
                <FontAwesomeIcon icon={faCog} />
              </button>
            </div>
          </div>
          <div onContextMenu={e => activeTab === 'unread' && cm.current.show(e)}>
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
