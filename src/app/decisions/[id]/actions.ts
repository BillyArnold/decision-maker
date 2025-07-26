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

export async function addOutcome(decisionId: string, text: string) {
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

  const outcome = await prisma.outcome.create({
    data: {
      text: text.trim(),
      decisionId: decisionId,
    },
  });

  // Revalidate the outcomes page
  revalidatePath(`/decisions/${decisionId}/outcomes`);

  return outcome;
}

export async function deleteOutcome(decisionId: string, outcomeId: string) {
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

  // Delete the outcome
  await prisma.outcome.delete({
    where: { 
      id: outcomeId,
      decisionId: decisionId, // Ensure the outcome belongs to this decision
    },
  });

  // Revalidate the outcomes page
  revalidatePath(`/decisions/${decisionId}/outcomes`);

  return { success: true };
} 

export async function updateOutcomeRatings(decisionId: string, ratings: Record<string, Record<string, number>>) {
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

  // Update or create each rating
  const ratingPromises = Object.entries(ratings).flatMap(([outcomeId, factorRatings]) =>
    Object.entries(factorRatings).map(([factorId, rating]) =>
      prisma.outcomeRating.upsert({
        where: {
          outcomeId_factorId: {
            outcomeId,
            factorId,
          },
        },
        update: {
          rating,
        },
        create: {
          rating,
          outcomeId,
          factorId,
        },
      })
    )
  );

  await Promise.all(ratingPromises);

  // Revalidate the rating page and decision page
  revalidatePath(`/decisions/${decisionId}/rate`);
  revalidatePath(`/decisions/${decisionId}`);

  return { success: true };
} 

export async function saveFactors(decisionId: string, factors: { id?: string; text: string; weight: number | null }[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Ensure the decision belongs to the user
  const decision = await prisma.decision.findUnique({
    where: { id: decisionId, userId: session.user.id },
    include: { factors: true },
  });
  if (!decision) {
    throw new Error('Decision not found');
  }

  // Find deleted factors
  const existingIds = decision.factors.map(f => f.id);
  const newIds = factors.filter(f => f.id).map(f => f.id);
  const toDelete = existingIds.filter(id => !newIds.includes(id));

  // Delete removed factors
  await Promise.all(toDelete.map(id =>
    prisma.factor.delete({ where: { id } })
  ));

  // Upsert (add or update) factors
  await Promise.all(factors.map(factor => {
    if (factor.id) {
      // Update
      return prisma.factor.update({
        where: { id: factor.id },
        data: { text: factor.text, weight: factor.weight },
      });
    } else {
      // Create
      return prisma.factor.create({
        data: {
          text: factor.text,
          weight: factor.weight,
          decisionId,
        },
      });
    }
  }));

  revalidatePath(`/decisions/${decisionId}`);
  return { success: true };
} 