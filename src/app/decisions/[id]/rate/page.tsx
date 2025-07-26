import React from 'react';
import { Heading } from '../../../../components';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import OutcomeRatingForm from './OutcomeRatingForm';

interface OutcomeRatingPageProps {
  params: {
    id: string;
  };
}

export default async function OutcomeRatingPage({ params }: OutcomeRatingPageProps) {
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
        },
        include: {
          ratings: {
            include: {
              factor: true
            }
          }
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

  // Check if there is at least 1 outcome
  if (decision.outcomes.length < 1) {
    redirect(`/decisions/${params.id}/outcomes`);
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
              3
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Step 3: Rate Outcomes</p>
              <p className="text-sm text-blue-700 mt-1">
                Rate how well each outcome performs against your factors. This will help determine which outcome is the best choice for your decision.
              </p>
            </div>
          </div>
        </div>

        {/* Rating Guide */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">Rating Guide</p>
              <p className="text-sm text-blue-700 mt-1">
                1 = Poor, 2 = Fair, 3 = Good, 4 = Very Good, 5 = Excellent
              </p>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <OutcomeRatingForm 
          decisionId={params.id} 
          factors={decision.factors}
          outcomes={decision.outcomes}
        />
      </div>
    </main>
  );
} 