"use client";

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const searchEngines = {
  'Google': 'https://www.google.com/search?q=',
  'Google Scholar': 'https://scholar.google.com/scholar?q=',
  'arXiv': 'https://arxiv.org/search/?query=',
  'Semantic Scholar': 'https://www.semanticscholar.org/search?q=',
};

const Search: React.FC = () => {
  const [searchEngine, setSearchEngine] = useState<keyof typeof searchEngines>('Google');
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const url = `${searchEngines[searchEngine]}${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex space-x-2 mb-2">
        {Object.keys(searchEngines).map((engine) => (
          <button
            key={engine}
            onClick={() => setSearchEngine(engine as keyof typeof searchEngines)}
            className={`px-4 py-2 rounded-t ${
              searchEngine === engine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
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
            onKeyPress={handleKeyPress}
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
  );
};

export default Search;