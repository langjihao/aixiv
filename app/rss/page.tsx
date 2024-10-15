'use client'
import RssReader from './RssReader';
import React, { useState, useRef, useEffect } from 'react';
import { XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
interface Rank {
  sciif: number;
  sciUp: string;
  ccf:string
}
interface RssSource {
  id: string;
  name: string;
  feedUrl: string;
  cover: string;
  url: string;
  description: string;
  //出版商
  publication: string;
}

const DefaultTabs = localStorage.getItem('RSS_Source') ? JSON.parse(localStorage.getItem('RSS_Source') || '') : [
  { id: 'MIA', description: 'Medical Image Analysis',name:'Medical Image Analysis',feedUrl:'https://rss.sciencedirect.com/publication/science/13618415',cover:'',url:'',publication:'Elsevier',Rank:{}},
  { id: 'TMI', description: 'IEEE Transaction on Medical Imaging',name:'IEEE Transaction on Medical Imaging',feedUrl:'https://ieeexplore.ieee.org/rss/TOC42.XML',cover:'',url:'',publication:'IEEE',Rank:{}},
  { id: 'TALSP', description: 'IEEE Transaction on Audio, Language and Speech Processing',name:'IEEE Transaction on Audio, Language and Speech Processing',feedUrl:'https://ieeexplore.ieee.org/rss/TOC6570655.XML',cover:'',url:'',publication:'IEEE',Rank:{}},
];
const RssPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState<RssSource[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTab, setEditingTab] = useState<RssSource | null>(null);
  const [formError, setFormError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTabs = localStorage.getItem('RSS_Source');
    if (storedTabs) {
      const parsedTabs = JSON.parse(storedTabs);
      setTabs(parsedTabs);
      setActiveTab(parsedTabs[0]?.id || '');
    } else {
      setTabs(DefaultTabs);
      setActiveTab(DefaultTabs[0]?.id || '');
    }
  }, []);

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
    // 添加更多出版物选项
  ];

  const handleSaveTab = () => {
    if (!editingTab || !editingTab.id || !editingTab.feedUrl) {
      setFormError('ID 和 RSS 链接为必填项');
      return;
    }
    
    let updatedTabs;
    if (tabs.some(tab => tab.id === editingTab.id)) {
      // 更新现有标签
      updatedTabs = tabs.map(tab => tab.id === editingTab.id ? editingTab : tab);
    } else {
      // 添加新标签
      updatedTabs = [...tabs, editingTab];
    }
    
    setTabs(updatedTabs);
    setShowModal(false);
    setEditingTab(null);
    setActiveTab(editingTab.id);
    localStorage.setItem('RSS_Source', JSON.stringify(updatedTabs));
    setFormError('');
  };

  const handleRemoveTab = (id: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    localStorage.setItem('RSS_Source', JSON.stringify(updatedTabs));
    if (activeTab === id) {
      setActiveTab(updatedTabs[0]?.id || '');
    }
  };

  const handleEditTab = (tab: RssSource) => {
    setEditingTab(tab);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 flex-wrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <div key={tab.id} className="group relative">
              <button
                className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors duration-200 flex items-center space-x-2
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.id}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <PencilIcon 
                    className="h-4 w-4 text-gray-400 hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTab(tab);
                    }}
                  />
                  <XCircleIcon 
                    className="h-4 w-4 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTab(tab.id);
                    }}
                  />
                </div>
              </button>
            </div>
          ))}
          <button
            className="py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors duration-200"
            onClick={() => {
              setEditingTab({ id: '', name: '', feedUrl: '', cover: '', url: '', description: '', publication: ''});
              setShowModal(true);
            }}
          >
            +
          </button>
        </nav>
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
      {tabs.length > 0 && (
        <RssReader feedUrl={tabs.find((tab) => tab.id === activeTab)?.feedUrl || ''} />
      )}
      {tabs.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-gray-500">请添加至少一个订阅源</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
            setEditingTab({ id: '', name: '', feedUrl: '', cover: '', url: '', description: '', publication: ''});
            setShowModal(true);
          }}>添加订阅源</button>
        </div>
      )}
    </div>
  );
};

export default RssPage;