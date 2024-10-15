'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Tab from './tab';
import RssReader from './RssReader';

const RssClientComponent: React.FC = () => {
  const [currentFeedUrl, setCurrentFeedUrl] = useState('');

  const handleTabChange = useCallback((feedUrl: string) => {
    console.log('标签已更改，新的 feedUrl:', feedUrl);
    setCurrentFeedUrl(feedUrl);
  }, []);

  useEffect(() => {
    console.log('currentFeedUrl 已更新:', currentFeedUrl);
  }, [currentFeedUrl]);

  return (
    <div className="container mx-auto p-4">
      <Tab onTabChange={handleTabChange} />
      {currentFeedUrl && <RssReader key={currentFeedUrl} feedUrl={currentFeedUrl} />}
    </div>
  );
};

export default RssClientComponent;
