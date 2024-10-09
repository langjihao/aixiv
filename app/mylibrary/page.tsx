'use client'
import React, { useState, useMemo, useEffect } from 'react';
import PaperCard from './PaperCard/PaperCard';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/solid';
import { PaperMain, UserPaper } from '../../types/DataModel';
import PaperModal from '../components/PaperModal/PaperModal';
import { useUser,SignIn } from '@clerk/nextjs';
import { fetchUserLibrary } from '../../lib/DataBase'
import LoadingComponent from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
const TABS = [
  { name: '想读', key: 0 },
  { name: '已略读', key: 2 },
  { name: '已精读', key: 3 },
  { name: '已复现', key: 4 },
//   { name: '在读', key: 1 },
];
interface UserPaperProps extends PaperMain{
  status: number
}

const MyLibrary: React.FC = () => {
  const [papers, setPapers] = useState<UserPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openModalId, setOpenModalId] = useState<string>('');
  const { user, isSignedIn } = useUser();
  const [isUserLoading, setIsUserLoading] = useState(true);
  useEffect(() => {
    if (user?.id) {
      setIsUserLoading(false);
    }
  }, [user]);
  useEffect(() => {
    const fetchPapers = async () => {
      if (!user?.id) {
        console.log('未登录');
        return;
      }
      try {
        setLoading(true);
        const data = await fetchUserLibrary(user.id, activeTab);
        setPapers(data as UserPaper[]);
      } catch (err) {
        setError('获取论文时出错。请稍后再试。');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPapers();
    }
  }, [user, activeTab]);

  const handleChangeTab = (key: number) =>{
    setActiveTab(key)
  }

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
      .sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime()); // 按时间戳升序排序
  }, [papers, selectedTags]);

  const allTags = useMemo(() => {
    const tags = papers.flatMap(paper => paper.tags);
    return Array.from(new Set(tags));
  }, [papers]);

  const tagCounts = useMemo(() => {
    return allTags.reduce((acc, tag) => {
      acc[tag] = papers.filter(paper => paper.tags.includes(tag)).length;
      return acc;
    }, {} as Record<string, number>);
  }, [allTags, papers]);

  const topTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA) // 按数量降序排序
      .slice(0, 10) // 取前10个标签
      .map(([tag]) => tag); // 仅保留标签名
  }, [tagCounts]);
  if (isUserLoading) {
    return <LoadingComponent />;
  }
  // Tab切换
  return(<>
  {isSignedIn ? (
    <>
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
        <div className="flex justify-center items-center h-64">
  <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
</div>
      ) : 
        papers.length === 0 ? (
          <EmptyState message="没有找到结果" icon="🔍" />
        ) : (
          papers.map((paper) => (
            <div key={paper.paper_id} onClick={() => handleOpenModal(paper.paper_id)}>
            <PaperCard
              paper_id={paper.paper_id}
              title={paper.title}
              viewMode={viewMode}
              score={paper.score}
              abstract={paper.abstract}
              authors={paper.authors}
              publication_date={paper.publication_date}
              tags={paper.tags}
            />
          </div>
        ))
      )
    }
      
      {openModalId !== '' && (<PaperModal paper_id={openModalId} onClose={handleCloseModal} />)}
    </div>
  </> ):(<SignIn/>)
}
</> )
};

export default MyLibrary;