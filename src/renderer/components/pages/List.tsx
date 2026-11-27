import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Post as PostType } from '@src/types';
import Post from '@components/Post';
import router from '@renderer/router';
import { ContextMenu } from 'primereact/contextmenu';
import util from '@main/window/utilContextApi';

export type Tab = 'unread' | 'all' | 'marked';
export default function List() {
  const [activeTab, setActiveTab] = useState<Tab>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<PostType[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>();
  const selectedPost = items.find(item => item.url === selectedUrl);
  const input = useRef<HTMLInputElement>(null);
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    let querying = false;
    const refresh = async () => {
      if (querying) return;
      querying = true;
      const start = revision.current;
      try {
        const posts = await util.getPosts();
        if (active && start === revision.current) setItems(posts);
      } catch (cause) {
        console.error('Could not refresh posts', cause);
      } finally {
        querying = false;
      }
    };
    void refresh();
    const interval = setInterval(refresh, 10_000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const readAll = async () => {
    const urls = new Set(items.map(item => item.url));
    await util.readPost([...urls]);
    revision.current++;
    setItems(prev => prev.map(item => urls.has(item.url) && !item.read ? { ...item, read: true } : item));
  };

  const deleteAllWithoutMarked = async () => {
    const urls = new Set(items.filter(item => !item.marked).map(item => item.url));
    await util.deletePost([...urls]);
    revision.current++;
    setItems(prev => prev.filter(item => !urls.has(item.url)));
  };

  const toggleMark = useCallback(async (post: PostType) => {
    if (post.marked) await util.unmarkPost(post.url);
    else await util.markPost(post.url);
    revision.current++;
    setItems(prev => prev.map(item => item.url === post.url ? { ...item, marked: !post.marked } : item));
  }, []);

  const setRead = useCallback(async (post: PostType) => {
    await util.readPost(post.url);
    revision.current++;
    setItems(prev => prev.map(item => item.url === post.url ? { ...item, read: true } : item));
  }, []);

  const remove = async () => {
    if (!selectedPost) return;
    await util.deletePost(selectedPost.url);
    revision.current++;
    setItems(prev => prev.filter(item => item.url !== selectedPost.url));
  };

  const visible = items.filter(post =>
    (activeTab !== 'unread' || !post.read) && (activeTab !== 'marked' || post.marked) && post.title.includes(searchQuery)
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup className='context-menu'>
            <ContextMenu.List>
              <ContextMenu.Item className='context-menu-item' onSelect={() => selectedPost && toggleMark(selectedPost)}>
                <i className='pi pi-bookmark' /> Toggle Mark
              </ContextMenu.Item>
              <ContextMenu.Item className='context-menu-item' onSelect={() => remove()}>
                <i className='pi pi-trash' /> Delete
              </ContextMenu.Item>
              {activeTab === 'unread' && (
                <ContextMenu.Item className='context-menu-item' onSelect={readAll}>
                  <i className='pi pi-check' /> Clear
                </ContextMenu.Item>
              )}
              {activeTab !== 'marked' && (
                <ContextMenu.Item className='context-menu-item' onSelect={deleteAllWithoutMarked}>
                  <i className='pi pi-filter-slash' /> Delete All without Marked
                </ContextMenu.Item>
              )}
            </ContextMenu.List>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
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
                <button className='button icon' onClick={() => setSearchQuery(input.current?.value ?? '')}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <button className='button icon' onClick={() => router.navigate('/settings')}>
                <FontAwesomeIcon icon={faCog} />
              </button>
            </div>
          </div>
          <div className='flex-grow overflow-auto border-t border-gray-300 mt-4 mb-4 pt-4'>
            {visible.map(item => (
              <ContextMenu.Trigger key={item.url} as='div'>
                <Post post={item} onClick={setRead} onContextMenu={setSelectedUrl} toggleMark={toggleMark} />
              </ContextMenu.Trigger>
            ))}
          </div>
        </div>
      </div>
    </ContextMenu.Root>
  );
}
