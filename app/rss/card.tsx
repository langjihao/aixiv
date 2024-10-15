import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface CardProps {
  title: string;
  abstract: string;
  pubDate: string;
  url: string;
  authors: string;
}

const Card: React.FC<CardProps> = ({ title, abstract, pubDate, url, authors }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDescription = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer flex-grow" onClick={toggleDescription}>
            {title}
          </h3>
          <button 
            onClick={toggleDescription}
            className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <span className="mr-4">{new Date(pubDate).toLocaleDateString()}</span>
          <span>{authors}</span>
        </div>
      </div>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-700 mb-3">{abstract}</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            阅读全文 →
          </a>
        </div>
      )}
    </div>
  );
};

export default Card;