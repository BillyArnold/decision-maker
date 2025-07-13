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
      </div>
    </main>
  );
} 