'use client';

import React from 'react';
import { Logo, Heading, Paragraph, Button } from '../components';
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
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Image */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Main Heading */}
        <div className="text-center mb-6">
          <Heading size="lg">
            Make decisions together, easily
          </Heading>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-12">
          <Paragraph>
            Simplify group decisions with our app. Vote, discuss and decide together, effortlessly.
          </Paragraph>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={handleGoogleLogin}>
            Log in with Google
          </Button>
          <Button size="lg">
            Join with code
          </Button>
        </div>
      </div>
    </main>
  );
}
