import React from 'react';
import { Heading, Button } from '../../../../components';
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

        {/* Outcomes Header */}
        <div className="mb-8">
          <Heading size="md">Outcomes</Heading>
          <p className="text-gray-text mt-2">
            Share what the possible outcomes of the decision could be, this could be either a simple Yes/No decision or multiple options, like holiday destinations
          </p>
        </div>

        {/* Outcomes List */}
        <OutcomesList 
          decisionId={params.id} 
          outcomes={decision.outcomes || []} 
        />
      </div>
    </main>
  );
} 