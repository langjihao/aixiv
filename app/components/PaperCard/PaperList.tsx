import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface PaperMain {
  id: string;
  title: string;
  authors: string;
  institution: string[];
  tags: string[];
  date: string;
  abstract: string;
  topic: string;
  url: string;
}

const PaperList: React.FC<PaperMain> = ({
  id,
  title,
  authors,
  institution,
  tags,
  date,
  abstract,
  topic,
  url,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });
  const institutionString = institution.join(', ');

  const commonContent = (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <h3
          className="text-xl font-semibold mb-2 line-clamp-2 flex-shrink-0"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex transition-shadow duration-300 hover:shadow-lg mb-4 p-4">
        {commonContent}
      </div>
  );
};

export default PaperList;