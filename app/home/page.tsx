'use client'
import React, { useState, useMemo, useEffect } from 'react';
import PaperCard from '../components/PaperCard/PaperCard';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/solid';
import { PaperMain } from '../../types/DataModel';
import PaperModal from '../components/PaperModal/PaperModal';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fetchPapersByTopic,fetchPaperByID } from '../../lib/DataBase';
import LoadingComponent from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const TABS = [
  { name: '医学报告', key: 'MRG' },
  { name: '图像分割', key: 'Medical Image Segmentation' },
  { name: '图像增强', key: 'Image Enhancement' },
  { name: '语音情感识别', key: 'Speech Emotion Recognition' },
  { name: '大模型', key: 'LLM' },
];

const HomePage: React.FC = () => {
  const [papers, setPapers] = useState<PaperMain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [openModalId, setOpenModalId] = useState<string>('');

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
    else setActiveTab(TABS[0].key)
  }, []);

  const handleChangeTab = (key: string) => {
    setActiveTab(key)
    localStorage.setItem('activeTab',key)
  }

  useEffect(() => {
    const fetchPapers = async () => {
      if(activeTab!=''){
        try {
          setLoading(true);
          const data = await fetchPapersByTopic(activeTab);
          setPapers(data);
        } catch (err) {
          setError('获取论文时出错。请稍后再试。');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPapers();
  }, [activeTab]);

  const handleOpenModal = (id: string) => {
    console.log('id:', id);
    setOpenModalId(id);
  };

  const handleCloseModal = () => {
    setOpenModalId('');
  };

  // 标签筛选与统计
  const sortedAndFilteredPapers = useMemo(() => {
    return papers
      .filter(paper =>
        selectedTags.length === 0 ||
        (Array.isArray(paper.tags) && selectedTags.every(tag => paper.tags.includes(tag)))
      )
      .sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
  }, [papers, selectedTags]);

  const allTags = useMemo(() => {
    const tags = papers.flatMap(paper => paper.tags);
    return Array.from(new Set(tags));
  }, [papers]);

  const tagCounts = useMemo(() => {
    return allTags.reduce((acc, tag) => {
      acc[tag] = papers.filter(paper => Array.isArray(paper.tags) && paper.tags.includes(tag)).length;
      return acc;
    }, {} as Record<string, number>);
  }, [allTags, papers]);

  const topTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [tagCounts]);

  // 按周分组
  const papersByWeek = useMemo(() => {
    return sortedAndFilteredPapers.reduce((acc, paper) => {
      const weekStart = format(startOfWeek(new Date(paper.publication_date)), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date(paper.publication_date)), 'yyyy-MM-dd');
      const weekKey = `${weekStart} - ${weekEnd}`;
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(paper);
      return acc;
    }, {} as Record<string, PaperMain[]>);
  }, [sortedAndFilteredPapers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="top-0 z-10">
        <div className='flex justify-between'>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {TABS.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded transition-colors duration-200 ${
                  activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleChangeTab(tab.key)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="mb-8 flex items-center gap-2">
            <button
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Squares2X2Icon className="w-6 h-6" />
            </button>
            <button
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {topTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )}
              >
                {tag} ({tagCounts[tag]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : sortedAndFilteredPapers.length === 0 ? (
        <EmptyState message="没有找到结果" icon="🔍" />
      ) : (
        Object.entries(papersByWeek).map(([week, papers]) => (
          <div key={week} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{week}</h2>
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
            }>
              {papers.map((paper) => (
                <div key={paper.paper_id} onClick={() => handleOpenModal(paper.paper_id)}>
                  <PaperCard
                    {...paper}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {openModalId !== '' && (<PaperModal paper_id={openModalId} onClose={handleCloseModal} />)}
    </div>
    
  );
}

export default HomePage;