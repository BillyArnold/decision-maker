import React from 'react';
import { Heading, Button } from '../../../../components';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import WeighFactorsForm from './WeighFactorsForm';

interface WeighFactorsPageProps {
  params: {
    id: string;
  };
}

export default async function WeighFactorsPage({ params }: WeighFactorsPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch the specific decision with factors
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
      }
    }
  });

  if (!decision) {
    notFound();
  }

  if (decision.factors.length === 0) {
    redirect(`/decisions/${params.id}`);
  }

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Heading size="lg">Weigh Factors</Heading>
          <p className="text-gray-text mt-2">{decision.title}</p>
        </div>

        {/* Weighing Form */}
        <WeighFactorsForm 
          decisionId={params.id} 
          factors={decision.factors} 
        />
      </div>
    </main>
  );
} 