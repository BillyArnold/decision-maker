'use client';

import React from 'react';
import { Logo, Heading, Paragraph, Button, HeaderImage } from '../components';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/decisions');
    }
  }, [session, router]);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/decisions' });
  };

  if (status === 'loading') {
    return (
      <main className="font-sans bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-orange-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Image Section */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <HeaderImage />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-16">
          <Heading size="lg" className="mb-6 text-gray-800">
            Make decisions together, easily
          </Heading>
          
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Simplify group decisions with our collaborative app. Vote, discuss, and decide together effortlessly with your team.
          </Paragraph>

          {/* CTA Section */}
          <div className="text-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGoogleLogin}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2 inline-block" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Structured Analysis</h3>
              <p className="text-gray-600 text-sm">Break down decisions into factors and outcomes for clear evaluation</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-800 mb-2">Team Collaboration</h3>
              <p className="text-gray-600 text-sm">Work together with your team to make better collective decisions</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Clear Results</h3>
              <p className="text-gray-600 text-sm">Get visual insights and summaries to understand your decisions</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
