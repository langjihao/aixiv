'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

interface RssSource {
  id: string;
  name: string;
  feedUrl: string;
  cover: string;
  url: string;
  description: string;
  publication: string;
}

const DefaultTabs: RssSource[] = [
  { id: 'MIA', description: 'Medical Image Analysis', name: 'Medical Image Analysis', feedUrl: 'https://rss.sciencedirect.com/publication/science/13618415', cover: '', url: '', publication: 'Elsevier' },
  { id: 'TMI', description: 'IEEE Transaction on Medical Imaging', name: 'IEEE Transaction on Medical Imaging', feedUrl: 'https://ieeexplore.ieee.org/rss/TOC42.XML', cover: '', url: '', publication: 'IEEE' },
{ id: 'TALSP', description: 'IEEE Transaction on Audio, Language and Speech Processing', name: 'IEEE Transaction on Audio, Language and Speech Processing', feedUrl: 'https://ieeexplore.ieee.org/rss/TOC6570655.XML', cover: '', url: '', publication: 'IEEE' },
{ id: 'OE', description: 'Optical Express', name: 'Optical Express', feedUrl: 'https://opg.optica.org/rss/opex_feed.xml', cover: '', url: '', publication: 'Elsevier' },
{ id: 'BOE', description: 'Biomedical Optics Express', name: 'Biomedical Optics Express', feedUrl: 'https://opg.optica.org/rss/boe_feed.xml', cover: '', url: '', publication: 'Optica' },
{ id: 'CBM', description: 'Computers in Biology and Medicine', name: 'Computers in Biology and Medicine', feedUrl: 'https://rss.sciencedirect.com/publication/science/00104825', cover: '', url: '', publication: 'Elsevier' },
{ id: 'NC', description: 'Neurocomputing', name: 'Neurocomputing', feedUrl: 'https://rss.sciencedirect.com/publication/science/09252312', cover: '', url: '', publication: 'Elsevier' },
];

const publications = [
  { value: '', label: '选择出版物' },
  { value: 'Elsevier', label: 'Elsevier' },
  { value: 'IEEE', label: 'IEEE' },
  { value: 'Springer', label: 'Springer' },
  { value: 'Wiley', label: 'Wiley' },
  { value: 'Oxford', label: 'Oxford' },
  { value: 'ACM', label: 'ACM' },
  { value: 'nature', label: 'Nature' },
  { value: 'science', label: 'Science' },
  { value: 'cell', label: 'Cell' },
];

interface TabProps {
  onTabChange: (feedUrl: string) => void;
}

const Tab: React.FC<TabProps> = React.memo(({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState<RssSource[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTab, setEditingTab] = useState<RssSource | null>(null);
  const [formError, setFormError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTabs = localStorage.getItem('RSS_Source');
    let initialTabs: RssSource[];
    if (storedTabs) {
      try {
        initialTabs = JSON.parse(storedTabs);
        if (!Array.isArray(initialTabs) || initialTabs.length === 0) {
          throw new Error('存储的数据无效');
        }
      } catch (error) {
        console.error('解析存储的 RSS 源时出错:', error);
        initialTabs = DefaultTabs;
      }
    } else {
      initialTabs = DefaultTabs;
    }
    setTabs(initialTabs);
    setActiveTab(initialTabs[0]?.id || '');
    onTabChange(initialTabs[0]?.feedUrl || '');
  }, [onTabChange]);

  const handleTabClick = useCallback((id: string, feedUrl: string) => {
    setActiveTab(id);
    onTabChange(feedUrl);
  }, [onTabChange]);

  const handleSaveTab = () => {
    if (!editingTab || !editingTab.id || !editingTab.feedUrl) {
      setFormError('ID 和 RSS 链接为必填项');
      return;
    }
    
    let updatedTabs;
    if (tabs.some(tab => tab.id === editingTab.id)) {
      updatedTabs = tabs.map(tab => tab.id === editingTab.id ? editingTab : tab);
    } else {
      updatedTabs = [...tabs, editingTab];
    }
    
    setTabs(updatedTabs);
    setShowModal(false);
    setEditingTab(null);
    setActiveTab(editingTab.id);
    localStorage.setItem('RSS_Source', JSON.stringify(updatedTabs));
    setFormError('');
    onTabChange(editingTab.feedUrl);
  };

  const handleRemoveTab = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    localStorage.setItem('RSS_Source', JSON.stringify(updatedTabs));
    if (activeTab === id && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
      onTabChange(updatedTabs[0].feedUrl);
    }
  }, [activeTab, onTabChange, tabs]);

  const handleEditTab = useCallback((tab: RssSource, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingTab(tab);
    setShowModal(true);
  }, []);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`flex items-center rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              activeTab === tab.id ? 'bg-blue-500 shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleTabClick(tab.id, tab.feedUrl)}
          >
            <span className={`px-4 py-2 font-medium ${
              activeTab === tab.id ? 'text-white' : 'text-gray-700'
            }`}>
              {tab.id}
            </span>
            <PencilIcon 
              className="h-4 w-4 text-gray-400 hover:text-blue-500 mx-1"
              onClick={(e) => handleEditTab(tab, e)}
            />
            <XCircleIcon 
              className="h-4 w-4 text-gray-400 hover:text-red-500 mx-1"
              onClick={(e) => handleRemoveTab(tab.id, e)}
            />
          </div>
        ))}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={() => {
            setEditingTab({ id: '', name: '', feedUrl: '', cover: '', url: '', description: '', publication: '' });
            setShowModal(true);
          }}
        >
          添加新 RSS 源
        </button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {editingTab?.id ? '编辑订阅源' : '添加新的订阅源'}
            </h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                  简称 <span className="text-red-500">*</span>
                </label>
                <input
                  id="id"
                  type="text"
                  required
                  placeholder="例如：Nature"
                  value={editingTab?.id || ''}
                  onChange={(e) => setEditingTab(prev => prev ? { ...prev, id: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="feedUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  RSS链接 <span className="text-red-500">*</span>
                </label>
                <input
                  id="feedUrl"
                  type="url"
                  required
                  placeholder="https://example.com/rss"
                  value={editingTab?.feedUrl || ''}
                  onChange={(e) => setEditingTab(prev => prev ? { ...prev, feedUrl: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="publication" className="block text-sm font-medium text-gray-700 mb-1">
                  出版物
                </label>
                <select
                  id="publication"
                  value={editingTab?.publication || ''}
                  onChange={(e) => setEditingTab(prev => prev ? { ...prev, publication: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {publications.map((pub) => (
                    <option key={pub.value} value={pub.value}>
                      {pub.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述（选填）
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="简短描述"
                  value={editingTab?.description || ''}
                  onChange={(e) => setEditingTab(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => {
                  setShowModal(false);
                  setEditingTab(null);
                  setFormError('');
                }}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSaveTab}
              >
                {editingTab?.id ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Tab.displayName = 'Tab';

export default Tab;