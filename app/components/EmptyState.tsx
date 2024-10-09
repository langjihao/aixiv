import React from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = '没有找到结果', 
  icon = '🔍' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-xl text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;