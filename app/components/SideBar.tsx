'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon, GlobeAsiaAustraliaIcon, PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface TabItem {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  isBeta?: boolean;
}

const tabs: TabItem[] = [
  { href: '/', label: 'Arxiv Daily', icon: BookOpenIcon },
  { href: '/navigation', label: '学术导航', icon: GlobeAsiaAustraliaIcon },
  // { href: '/create', label: '无限画布', icon: PencilSquareIcon, isBeta: true },
  // { href: '/team', label: '团队版', icon: UserGroupIcon, isBeta: true },
  // { href: '/add', label: '导入文献', icon: PlusCircleIcon, isBeta: true },
];

interface SideBarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isExpanded, onToggle }) => {
  const pathname = usePathname();

  return (
    <nav className={`bg-white shadow-md transition-all duration-300 flex flex-col ${!isExpanded ? 'w-16' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-between px-4">
        {isExpanded && <h1 className="text-2xl font-bold text-blue-600">AIxiv Daily</h1>}
        <button 
          onClick={onToggle} 
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          {!isExpanded ? (
            <Bars3Icon className="w-6 h-6" />
          ) : (
            <XMarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      <ul className="mt-8 flex-grow">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="mb-4">
              <Link 
                href={tab.href} 
                className={`flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 transition-colors ${pathname === tab.href ? 'bg-gray-100 font-semibold' : ''}`}
              >
                <div className="relative group">
                  <Icon className={`w-6 h-6 ${!isExpanded ? 'mx-auto' : 'mr-4'}`} />
                  {!isExpanded && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {tab.label}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <span className="flex items-center">
                    {tab.label}
                    {tab.isBeta && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        Beta
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideBar;