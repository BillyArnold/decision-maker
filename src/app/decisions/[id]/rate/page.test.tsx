import { render, screen } from '@testing-library/react';
import OutcomeRatingPage from './page';

// Mock the database and auth
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    decision: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('OutcomeRatingPage', () => {
  it('should display outcome rating heading and description', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
      ],
      outcomes: [
        { id: '1', text: 'Move to New York' },
        { id: '2', text: 'Stay in current city' },
      ],
    };

    // Mock the database response
    const { prisma } = require('../../../../lib/prisma');
    prisma.decision.findUnique.mockResolvedValue(mockDecision);

    // Mock the session
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user1' },
    });

    // This will fail because the component doesn't exist yet
    render(await OutcomeRatingPage({ params: { id: '1' } }));
    
    expect(screen.getByText('Outcome Rating')).toBeInTheDocument();
    expect(screen.getByText(/Check the boxes below/)).toBeInTheDocument();
  });
}); 