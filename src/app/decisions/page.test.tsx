import { render, screen } from '@testing-library/react';
import DecisionsPage from './page';

// Mock the database and auth
jest.mock('../../lib/prisma', () => ({
  prisma: {
    decision: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('DecisionsPage', () => {
  it('should display modern decisions list with enhanced cards', async () => {
    const mockDecisions = [
      { id: '1', title: 'Should I move to a new city?', status: 'In Progress', createdAt: new Date() },
      { id: '2', title: 'Which laptop should I buy?', status: 'Completed', createdAt: new Date() },
    ];

    // Mock the database response
    const { prisma } = require('../../lib/prisma');
    prisma.decision.findMany.mockResolvedValue(mockDecisions);

    // Mock the session
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });

    render(await DecisionsPage());
    
    // Should find modern decision cards
    expect(screen.getByText('Should I move to a new city?')).toBeInTheDocument();
    expect(screen.getByText('Which laptop should I buy?')).toBeInTheDocument();
    
    // Should display modern card layout
    const cards = document.querySelectorAll('.bg-white.border.border-gray-200.rounded-xl');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display modern empty state with icon', async () => {
    // Mock the database response
    const { prisma } = require('../../lib/prisma');
    prisma.decision.findMany.mockResolvedValue([]);

    // Mock the session
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });

    render(await DecisionsPage());
    
    // Should find modern empty state
    expect(screen.getByText('No decisions yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first decision')).toBeInTheDocument();
  });

  it('should display modern add decision button', async () => {
    const mockDecisions = [
      { id: '1', title: 'Should I move to a new city?', status: 'In Progress', createdAt: new Date() },
    ];

    // Mock the database response
    const { prisma } = require('../../lib/prisma');
    prisma.decision.findMany.mockResolvedValue(mockDecisions);

    // Mock the session
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });

    render(await DecisionsPage());
    
    // Should find modern add button
    expect(screen.getByText('Add Decision')).toBeInTheDocument();
  });
}); 