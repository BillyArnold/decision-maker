import React from 'react';
import { Heading } from '../../../../components';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import OutcomesList from './OutcomesList';

interface OutcomesPageProps {
  params: {
    id: string;
  };
}

export default async function OutcomesPage({ params }: OutcomesPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch the specific decision with factors and outcomes
  const decision = await prisma.decision.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      factors: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      outcomes: {
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
  const allFactorsWeighted = decision.factors.length > 0 && 
    decision.factors.every((factor: any) => factor.weight !== null);

  if (!allFactorsWeighted) {
    redirect(`/decisions/${params.id}/weigh`);
  }

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Decision Header */}
        <div className="mb-8">
          <Heading size="lg">{decision.title}</Heading>
          <p className="text-gray-text mt-2">Status: {decision.status}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
              2
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Step 2: Define Outcomes</p>
              <p className="text-sm text-blue-700 mt-1">
                List all possible outcomes or options for your decision.
              </p>
            </div>
          </div>
        </div>

        {/* Outcomes List */}
        <OutcomesList 
          outcomes={decision.outcomes || []} 
        />
      </div>
    </main>
  );
} 