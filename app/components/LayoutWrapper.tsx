'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
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
              <Link href="/mylibrary" className="ml-4 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                我的文库
              </Link>
              <Link href="/teamlibrary" className="ml-4 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300">
                团队文库
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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