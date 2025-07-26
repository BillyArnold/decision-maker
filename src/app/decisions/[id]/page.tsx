import React from 'react';
import { Heading, Button } from '../../../components';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import FactorsForm from '../../../components/FactorsForm';

interface DecisionPageProps {
  params: {
    id: string;
  };
}

export default async function DecisionPage({ params }: DecisionPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch the specific decision
  const decision = await prisma.decision.findUnique({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user can only access their own decisions
    },
    include: {
      factors: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  if (!decision) {
    notFound();
  }

  // Check if all factors have weights
  const allFactorsWeighted = decision.factors.length > 0 && decision.factors.every((factor: any) => factor.weight !== null);

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Heading size="lg">{decision.title}</Heading>
          <p className="text-gray-text mt-2">Status: {decision.status}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
              1
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Step 1: Define Factors</p>
              <p className="text-sm text-blue-700 mt-1">
                Identify and rate the importance of factors that matter to your decision.
              </p>
            </div>
          </div>
        </div>

        {/* Factors Form (add, edit, weigh, delete) */}
        <FactorsForm initialFactors={decision.factors || []} />

        {/* Progress and Next Step */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${allFactorsWeighted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-600">
                  {allFactorsWeighted ? 'Factors complete' : 'Complete factors to proceed'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {decision.factors.length} factor{decision.factors.length !== 1 ? 's' : ''} added
              </span>
            </div>
            
            {/* Next Step Button */}
            <div className="flex justify-end">
              <a href={allFactorsWeighted ? `/decisions/${params.id}/outcomes` : undefined}>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  disabled={!allFactorsWeighted}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Next: Possible Outcomes
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 