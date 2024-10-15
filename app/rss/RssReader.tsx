'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card';
import { RssParser } from './utils';

interface GroupedItems {
  [date: string]: any[];
}

const RssReader: React.FC<{ feedUrl: string }> = ({ feedUrl }) => {
  const [loading, setLoading] = useState(false);
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({}); // Updated state variable
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRss = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const feed = await RssParser(response.data);
        // 对结果进行分组
        const grouped = feed.reduce((acc: GroupedItems, item: any) => {
          const date = new Date(item.feedTime).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        }, {});

        setGroupedItems(grouped);
        console.log(grouped);
      } catch (err) {
        setError('无法获取 RSS 源，请检查 URL 或网络连接。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRss();
  }, [feedUrl]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">RSS Feed</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">加载中...</p>}
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{date}</h3>
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card 
                key={index} 
                title={item.title} 
                abstract={item.abstract} 
                pubDate={item.feedTime} 
                authors={item.authors}
                url={item.mainURL}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RssReader;