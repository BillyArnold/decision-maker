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

        {/* Rating Header */}
        <div className="mb-8">
          <Heading size="md">Outcome Rating</Heading>
          <p className="text-gray-text mt-2">
            Check the boxes below to help decide how each of the possible outcomes may resonate with the factors for a successful decision
          </p>
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