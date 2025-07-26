import React from 'react';
import { Heading, Paragraph } from '../../components';

export default function SetupPage() {
  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Heading size="lg">Setup Instructions</Heading>
        
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Create .env.local file</h2>
            <div className="bg-gray-light p-4 rounded-lg">
              <pre className="text-sm">
{`# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="testtest"

# Google OAuth (you need to add these)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`}
              </pre>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Get Google OAuth Credentials</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-text">
              <li>Go to <a href="https://console.cloud.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener">Google Cloud Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the Google+ API</li>
              <li>Go to Credentials → Create Credentials → OAuth 2.0 Client ID</li>
              <li>Set Application Type to "Web application"</li>
              <li>Add <code className="bg-gray-border px-1 rounded">http://localhost:3001/api/auth/callback/google</code> as Authorized redirect URI</li>
              <li>Copy the Client ID and Client Secret</li>
              <li>Add them to your .env.local file</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Restart the development server</h2>
            <p className="text-gray-text">
              After adding the environment variables, restart your development server:
            </p>
            <div className="bg-gray-light p-4 rounded-lg mt-2">
              <code className="text-sm">npm run dev</code>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary text-white rounded-lg">
            <h3 className="font-semibold mb-2">Current Status:</h3>
            <ul className="space-y-1 text-sm">
              <li>✅ Database: Configured</li>
              <li>✅ NextAuth: Configured</li>
              <li>❌ Google OAuth: Needs credentials</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 