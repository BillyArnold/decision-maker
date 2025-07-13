'use server';

import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function addFactor(decisionId: string, text: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Ensure the decision belongs to the user
  const decision = await prisma.decision.findUnique({
    where: { id: decisionId, userId: session.user.id },
  });
  if (!decision) {
    throw new Error('Decision not found');
  }

  const factor = await prisma.factor.create({
    data: {
      text: text.trim(),
      decisionId: decisionId,
    },
  });

  // Revalidate the decision page
  revalidatePath(`/decisions/${decisionId}`);

  return factor;
}

export async function deleteFactor(decisionId: string, factorId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Ensure the decision belongs to the user
  const decision = await prisma.decision.findUnique({
    where: { id: decisionId, userId: session.user.id },
  });
  if (!decision) {
    throw new Error('Decision not found');
  }

  // Delete the factor
  await prisma.factor.delete({
    where: { 
      id: factorId,
      decisionId: decisionId, // Ensure the factor belongs to this decision
    },
  });

  // Revalidate the decision page
  revalidatePath(`/decisions/${decisionId}`);

  return { success: true };
}

export async function updateFactorWeights(decisionId: string, weights: Record<string, number>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Ensure the decision belongs to the user
  const decision = await prisma.decision.findUnique({
    where: { id: decisionId, userId: session.user.id },
  });
  if (!decision) {
    throw new Error('Decision not found');
  }

  // Update each factor's weight
  const updatePromises = Object.entries(weights).map(([factorId, weight]) =>
    prisma.factor.update({
      where: { 
        id: factorId,
        decisionId: decisionId, // Ensure the factor belongs to this decision
      },
      data: { weight }
    })
  );

  await Promise.all(updatePromises);

  // Revalidate the decision page
  revalidatePath(`/decisions/${decisionId}`);

  return { success: true };
} 