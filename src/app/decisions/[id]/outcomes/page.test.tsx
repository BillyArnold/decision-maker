import { render, screen } from '@testing-library/react';
import OutcomesPage from './page';

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

describe('OutcomesPage', () => {
  it('should display outcomes heading and description', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
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
    render(await OutcomesPage({ params: { id: '1' } }));
    
    expect(screen.getByText('Outcomes')).toBeInTheDocument();
    expect(screen.getByText(/Share what the possible outcomes/)).toBeInTheDocument();
  });
}); 