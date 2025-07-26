import React from 'react';
import { Heading, DecisionCard, Button } from '../../components';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function DecisionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch decisions from the database for the authenticated user
  const decisions = await prisma.decision.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Heading size="lg">My Decisions</Heading>
          <p className="text-gray-text mt-2">
            Manage and track your decision-making process
          </p>
        </div>

        {/* Header with add button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {decisions.length === 0 ? 'Get Started' : 'Recent Decisions'}
            </h2>
            {decisions.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {decisions.length} decision{decisions.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <a href="/decisions/new">
            <Button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Decision
            </Button>
          </a>
        </div>

        {/* Decisions List */}
        {decisions.length > 0 ? (
          <div className="space-y-4">
            {decisions.map((decision: any) => (
              <a key={decision.id} href={`/decisions/${decision.id}`} className="block">
                <DecisionCard
                  title={decision.title}
                  status={decision.status}
                />
              </a>
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No decisions yet</h3>
                <p className="text-gray-500 mb-6">
                  Start making better decisions by creating your first decision. Our step-by-step process will help you think through your options systematically.
                </p>
              </div>
              
              <div className="space-y-4">
                <a href="/decisions/new">
                  <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create your first decision
                  </Button>
                </a>
                
                {/* Feature highlights */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Define Factors</h4>
                    <p className="text-xs text-gray-500 mt-1">Identify what matters most</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Compare Options</h4>
                    <p className="text-xs text-gray-500 mt-1">Rate each outcome</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Get Results</h4>
                    <p className="text-xs text-gray-500 mt-1">See the best choice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 