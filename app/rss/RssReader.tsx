'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card';
import { RssParser } from './utils';
// import { Feed } from "@/models/feed";
const RssReader: React.FC<{ feedUrl: string }> = ({ feedUrl }) => {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRss = async () => {
      try {
        const response = await axios.get(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const feed = await RssParser(response.data);
        setItems(feed);
        console.log(feed);
      } catch (err) {
        setError('无法获取 RSS 源，请检查 URL 或网络连接。');
        console.error(err);
      }
    };

    fetchRss();
  }, [feedUrl]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">RSS Feed</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} title={item.title} description={item.abstract} pubDate={item.pubDate} />
        ))}
      </div>
    </div>
  );
};

export default RssReader;