'use client';
import React, { useState } from 'react';
import Search from '../components/Search/OnlineSearch';
import SiteLink from './SiteLink';
import { academicSites } from '../consts/navItem';

interface AcademicSite {
  name: string;
  url: string;
  description: string;
}

interface Sites {
  [key: string]: AcademicSite[];
}

const NavigationPage: React.FC = () => {
  const [sites, setSites] = useState<Sites>(academicSites);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Search />
      </div>
      {Object.keys(sites).map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sites[category].map((site: AcademicSite) => (
              <SiteLink site={site} key={site.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationPage;