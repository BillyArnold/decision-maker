import React from 'react';
import { Heading, Button } from '../../../components';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import FactorsList from '../../../components/FactorsList';

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <Heading size="lg">{decision.title}</Heading>
            <p className="text-gray-text mt-2">Status: {decision.status}</p>
          </div>
          <div className="flex gap-2">
            {decision.factors && decision.factors.length > 0 && (
              <a href={`/decisions/${params.id}/weigh`}>
                <Button size="sm" className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  Weigh factors
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Factors List */}
        <FactorsList factors={decision.factors || []} />

        {/* Finished Weighing Button */}
        <div className="mt-8 flex flex-col items-end gap-4">
          <a href={allFactorsWeighted ? `/decisions/${params.id}/outcomes` : undefined}>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!allFactorsWeighted}
            >
              I'm finished weighing out my factors
            </Button>
          </a>
          <a href={`/decisions/${params.id}/summary`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              View Summary
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
} 