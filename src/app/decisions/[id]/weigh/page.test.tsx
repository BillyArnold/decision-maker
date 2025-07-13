import { render, screen, fireEvent } from '@testing-library/react';
import WeighFactorsPage from './page';

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

describe('WeighFactorsPage', () => {
  it('should display factors with radio inputs for weighing', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: null },
        { id: '2', text: 'Cost of living', weight: null },
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
    render(await WeighFactorsPage({ params: { id: '1' } }));
    
    expect(screen.getByText('Weigh Factors')).toBeInTheDocument();
    expect(screen.getByText('Job opportunities')).toBeInTheDocument();
    expect(screen.getByText('Cost of living')).toBeInTheDocument();
    
    // Should have radio inputs for each factor (1-5 scale)
    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs.length).toBeGreaterThan(0);
  });
}); 