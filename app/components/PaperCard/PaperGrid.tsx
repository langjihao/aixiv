import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
interface PaperMain {
  id: string;
  cover: string;
  title: string;
  authors: string;
  institution: string[];
  tags: string[];
  date: string;
  abstract: string;
  topic: string;
  url: string;
}

const PaperGrid: React.FC<PaperMain> = ({
  id,
  cover,
  title,
  authors,
  institution,
  tags,
  date,
  abstract,
  topic,
  url,
}) => {

  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });
  const institutionString = institution.join(', ');

  const img = cover!='[]' ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/static/${cover}` : 'arxiv-logo.png';

  const commonContent = (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <h3 
          className="text-sm font-semibold mb-2 line-clamp-2 flex-shrink-0" 
          title={title}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-shrink-0">
          {authors}
        </p>
        <p className="text-sm text-gray-500 mb-2 flex-shrink-0">{institutionString}</p>
        <p className="text-sm text-gray-500 mb-2 flex-shrink-0">日期: {formattedDate}</p>
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
    </div>
  );


    return (
        <Link href={`/detail/${id}`}>
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-lg" style={{height: '480px'}}>
            <div 
            className="relative h-48 overflow-hidden cursor-pointer flex-shrink-0" 
            >
            <img src={img} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
            {commonContent}
            </div>
        </div>
        </Link>
    );
}
export default PaperGrid;