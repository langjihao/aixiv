'use client'
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow flex flex-col overflow-hidden transition-all duration-300">
        <header className="flex-shrink-0 bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="AIxiv Daily" width={160} height={120} />
              </Link>
              <Link href="/navigation" className="ml-4 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                学术导航
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* <SignedIn>
                <UserCircleIcon href="./dashboard" className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900"/>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                    登录
                  </button>
                </SignInButton>
              </SignedOut> */}
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