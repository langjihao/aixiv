import React, { useState } from 'react';
import Link from 'next/link';

const SiteLink = ({ site }) => {
  const [isHovered, setIsHovered] = useState(false);
    const logo = './logo/'+site.name.replace(' ','_')+'.png';
  return (
    <Link 
      href={site.url} 
      key={site.name}
      target="_blank" 
      rel="noopener noreferrer" 
      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={site.description} // 悬浮显示原始文字
    >
      <div className="flex flex-col items-center mb-2">
        <img src={logo} alt={`${site.name} logo`} className="w-12 h-12 mb-2" />
        <h2 className="text-lg font-semibold text-center">{site.name}</h2>
      </div>
    </Link>
  );
};

export default SiteLink;