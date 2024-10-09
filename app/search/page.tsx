'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { searchPapersByQuery, searchPaperBypaperId, searchPapersByTitle } from '@/lib/SemanticAPI';
import PaperSidebar from './sidebar';
import PaperCard from '@/app/components/PaperCard/PaperCard';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [paperData, setPaperData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    if (query !== '') {
      handleSearch(query);
    }
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.trim()) {
      try {
        const results = await searchPapersByTitle(searchTerm);
        setSearchResults(results.data);
      } catch (error) {
        console.error('搜索出错:', error);
      }
    }
  };

  const handlePaperClick = async (paperId: string) => {
    setIsSidebarOpen(true);
    setIsLoadingPaper(true);
    const paper = await searchPaperBypaperId(paperId);
    console.log(paper);
    setPaperData(paper);
    setIsLoadingPaper(false);
  };

  return (
    <div className="relative">
      {/* 左侧内容区域 */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">没有找到相关的结果。</p>
            </div>
          ) : (
            searchResults.map((item) => (
              <PaperCard key={item.paperId} {...item} />
            ))
          )}
        </div>
      </div>

      {/* 右侧侧边栏 */}
      {isSidebarOpen && (
        <PaperSidebar
          paperData={paperData}
          isLoading={isLoadingPaper}
          onClose={() => setIsSidebarOpen(false)}
          navbarHeight={navbarHeight} // 传递导航栏高度
        />
      )}
    </div>
  );
};

export default SearchPage;