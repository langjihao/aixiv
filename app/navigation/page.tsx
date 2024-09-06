'use client'

import React, { useState } from 'react';
import SiteLink from './SiteLink';
import { academicSites } from '../consts/navitem';
import { FaSearch } from 'react-icons/fa';

interface AcademicSite {
  name: string;
  url: string;
  description: string;
}
interface SearchEngine {
  [key: string]: string;
}

interface SearchEngines {
  SearchEngine:SearchEngine[];
}

const searchEngines = {
  'Google': 'https://www.google.com/search?q=',
  'Google Scholar': 'https://scholar.google.com/scholar?q=',
  'arXiv': 'https://arxiv.org/search/?query=',
  'Semantic Scholar': 'https://www.semanticscholar.org/search?q=',
};

const NavigationPage: React.FC = () => {
  const [sites, setSites] = useState(academicSites);
  const [searchEngine, setSearchEngine] = useState('Google');
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const url = `${searchEngines[searchEngine]}${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="flex space-x-2 mb-2">
            {Object.keys(searchEngines).map((engine) => (
              <button
                key={engine}
                onClick={() => setSearchEngine(engine)}
                className={`px-4 py-2 rounded-t ${
                  searchEngine === engine
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {engine}
              </button>
            ))}
          </div>
          <div className="flex items-center w-full justify-center">
            <div className="flex items-center w-2/3 max-w-lg">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-gray-300 rounded-l px-4 py-2 w-full h-12"
                placeholder="输入搜索内容..."
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-r h-12 flex items-center justify-center"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>
      {Object.keys(sites).map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sites[category].map((site: AcademicSite) => (
              <SiteLink site={site} key={site.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationPage;