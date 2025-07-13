import { render, screen } from '@testing-library/react';
import DecisionPage from './page';

// Mock the database and auth
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    decision: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('DecisionPage', () => {
  it('should display decision title and factors list', async () => {
    // This test will fail initially - that's our Red step
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      status: 'In Progress',
      factors: [
        { id: '1', text: 'Job opportunities' },
        { id: '2', text: 'Cost of living' },
      ],
    };

    // Mock the database response
    const { prisma } = require('../../../lib/prisma');
    prisma.decision.findUnique.mockResolvedValue(mockDecision);

    // Mock the session
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });

    // This will fail because the component doesn't exist yet
    render(await DecisionPage({ params: { id: '1' } }));
    
    expect(screen.getByText('Should I move to a new city?')).toBeInTheDocument();
    expect(screen.getByText('Job opportunities')).toBeInTheDocument();
    expect(screen.getByText('Cost of living')).toBeInTheDocument();
  });
}); 