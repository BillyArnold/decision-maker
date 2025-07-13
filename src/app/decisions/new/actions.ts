'use server';

import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function createDecision(title: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    const decision = await prisma.decision.create({
      data: {
        title: title.trim(),
        status: 'In Progress',
        userId: session.user.id
      }
    });

    // Revalidate the decisions page to show the new decision
    revalidatePath('/decisions');
    
    return decision;
  } catch (error) {
    console.error('Error creating decision:', error);
    throw new Error('Failed to create decision');
  }
} 