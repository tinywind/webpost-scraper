import React, { useEffect, useRef, useState, createContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Post as PostType } from '@src/types';
import Post from '@components/Post';
import router from '@renderer/router';
import { ContextMenu } from 'primereact/contextmenu';
import util from '@main/window/utilContextApi';

export const HiddenContext = createContext<{ [key: string]: boolean }>({});

export default function List() {
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'marked'>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<PostType[]>([]);
  const [hiddenState, setHiddenState] = useState<{ [key: string]: boolean }>({});
  const cm = useRef<ContextMenu>(null);
  const input = useRef<HTMLInputElement>(null);

  const hidden = (post: PostType) => (activeTab === 'unread' && post.read) || (activeTab === 'marked' && !post.marked) || !post.title.includes(searchQuery);

  useEffect(() => {
    setHiddenState(items.reduce((acc, item) => ({ ...acc, [item.url]: hidden(item) }), {}));
  }, [activeTab]);

  useEffect(() => {
    setHiddenState(items.reduce((acc, item) => ({ ...acc, [item.url]: hidden(item) }), {}));
  }, [searchQuery]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newPosts = await util.getPosts();
      const newPostsMap = new Map(newPosts.map(post => [post.url, post]));

      setItems(prevItems => {
        const prevUrls = new Set(prevItems.map(item => item.url));
        const newItems = newPosts.filter(post => !prevUrls.has(post.url));
        const updating = [...newItems, ...prevItems.filter(item => newPostsMap.has(item.url))];

        setHiddenState(prevItems => ({ ...prevItems, ...newItems.reduce((acc, item) => ({ ...acc, [item.url]: hidden(item) }), {}) }));

        return updating;
      });
    }, 10 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMark = async (post: PostType) => {
    post.marked ? await util.unmarkPost(post.url) : await util.markPost(post.url);
    post.marked = !post.marked;
    setItems(prev => [...prev]);

    setHiddenState(prevState => ({ ...prevState, [post.url]: hidden(post) }));
  };

  const setRead = async (post: PostType) => {
    await util.readPost(post.url);
    post.read = true;
    setItems(prev => [...prev]);

    setHiddenState(prevState => ({ ...prevState, [post.url]: hidden(post) }));
  };

  const readAll = async () => {
    await util.readPost(items.map(item => item.url));
    setItems(prev => prev.map((e: PostType) => ({ ...e, read: true })));

    setHiddenState(items.reduce((acc, item) => ({ ...acc, [item.url]: hidden(item) }), {}));
  };

  return (
    <>
      <ContextMenu model={[{ label: 'Clear', icon: 'pi pi-check', command: readAll }]} ref={cm} breakpoint='767px' />
      <div className='p-4 relative' style={{ height: 'calc(100% - 2rem)' }}>
        <div className='flex flex-col relative h-full max-w-2xl mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <div className='text-lg font-bold'>
              <button className={`button px-3 py-2 ${activeTab === 'unread' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('unread')}>
                Unread ({items.filter(item => !item.read).length})
              </button>
              <button className={`button px-3 py-2 ${activeTab === 'all' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('all')}>
                All ({items.length})
              </button>
              <button className={`button px-3 py-2 ${activeTab === 'marked' ? 'font-extrabold button-active-bgcolor' : ''}`} onClick={() => setActiveTab('marked')}>
                Marked ({items.filter(item => item.marked).length})
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
            <HiddenContext.Provider value={hiddenState}>
              {items.map(item => (
                <Post key={item.url} index={item.url} post={item} onClick={setRead} toggleMark={toggleMark} hiddenContext={HiddenContext} />
              ))}
            </HiddenContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}
