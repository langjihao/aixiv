import RssReader from './RssReader';
import React from 'react';
const RssPage: React.FC = () => {
  // ... 其他代码 ...
  return (
    <div>
      {/* 其他内容 */}
      {/* <RssReader feedUrl="https://rss.sciencedirect.com/publication/science/13618415" /> */}
    <RssReader feedUrl="https://ieeexplore.ieee.org/rss/TOC42.XML" />
    </div>
  );
};

export default RssPage;