'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Input } from "antd";
import BaseSearch from './Search/BaseSearch';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow flex flex-col overflow-hidden transition-all duration-300">
        <header className="flex-shrink-0 bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4 w-1/3">
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="AIxiv Daily" width={160} height={120} />
              </Link>
              <Link href="/" className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                ArXiv订阅
              </Link>
              <Link href="/navigation" className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                学术导航
              </Link>
              <Link href="/rss" className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                期刊RSS
              </Link>
            </div>
            <div className="flex justify-center w-1/3">
              <BaseSearch />
            </div>
            <div className="flex items-center justify-end space-x-4 w-1/3">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>
        <main className="flex-grow overflow-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;