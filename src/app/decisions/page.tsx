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
        {/* Header with title and add button */}
        <div className="flex justify-between items-center mb-8">
          <Heading size="lg">Decisions</Heading>
          <a href="/decisions/new">
            <Button size="sm" className="flex items-center gap-2">
              <span className="text-lg">+</span>
              Add Decision
            </Button>
          </a>
        </div>

        {/* Decisions List */}
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

        {/* Empty state (shown when there are no decisions) */}
        {decisions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-text mb-4">No decisions yet</p>
            <a href="/decisions/new">
              <Button>Create your first decision</Button>
            </a>
          </div>
        )}
      </div>
    </main>
  );
} 