import React, { useState } from 'react';
import Link from 'next/link';

interface PaperListProps {
  arxiv_id: string;
  cover: string | null;
  title: string;
  authors: string[] | null;
  institutions: string[] | null;
  tags: string[];
  publication_date: string;
  score: number; // 接收评分字段
}

const PaperList: React.FC<PaperListProps> = ({
  arxiv_id,
  cover,
  title,
  authors,
  institutions,
  tags,
  publication_date,
  score,
}) => {
  const formattedDate = new Date(publication_date).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });
  const institutionString = institutions ? institutions.join(', ') : '';

  // 评分组件
  const renderStars = (score: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-xl ${star <= score ? 'text-yellow-500' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // 操作按钮处理
  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  const handleViewDetails = () => {
    console.log('View details clicked');
  };

  const commonContent = (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 flex-shrink-0" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-shrink-0">{authors}</p>
        <p className="text-sm text-gray-500 mb-2 flex-shrink-0">{institutionString}</p>
        <p className="text-sm text-gray-500 mb-2 flex-shrink-0">日期: {formattedDate}</p>
        {renderStars(score)} {/* 显示评分星星 */}
      </div>
      <div className="mt-auto">
        <div className="flex flex-wrap gap-1 overflow-hidden" style={{ maxHeight: 'calc(2 * (1.5rem + 2px))' }}>
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded inline-block">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <button onClick={handleEdit} className="bg-blue-500 text-white px-2 py-1 rounded">编辑</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">删除</button>
        <button onClick={handleViewDetails} className="bg-green-500 text-white px-2 py-1 rounded">查看详情</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex transition-shadow duration-300 hover:shadow-lg mb-4 p-4">
      {commonContent}
    </div>
  );
};

export default PaperList;