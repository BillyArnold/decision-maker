'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './index';

export default function TopBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-gray-border py-4">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        {/* Home Icon */}
        <Link href="/" className="flex items-center gap-2 text-gray-text hover:text-primary transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Home</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/decisions" className="text-sm text-gray-text hover:text-primary transition-colors">
                My decisions
              </Link>
              <Link href="/components" className="text-sm text-gray-text hover:text-primary transition-colors">
                Components
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-text">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  variant="text" 
                  size="sm" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/setup" className="text-sm text-gray-text hover:text-primary transition-colors">
                Setup
              </Link>
              <Link href="/components" className="text-sm text-gray-text hover:text-primary transition-colors">
                Components
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 