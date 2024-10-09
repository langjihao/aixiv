import React, { useState } from 'react';

interface CardProps {
  title: string;
  description: string;
  pubDate: string;
}

const Card: React.FC<CardProps> = ({ title, description, pubDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDescription = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3
        onClick={toggleDescription}
        className="text-lg font-semibold cursor-pointer hover:text-blue-600"
      >
        {title}
      </h3>
      {isOpen && (
        <div className="mt-2">
          <p className="text-gray-700">{description}</p>
          <p className="text-sm text-gray-500 mt-1">{pubDate}</p>
        </div>
      )}
    </div>
  );
};

export default Card;