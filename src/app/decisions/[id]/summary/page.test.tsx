import { render, screen } from '@testing-library/react';
import SummaryPage from './page';

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

describe('SummaryPage', () => {
  it('should display modern summary with recommendation', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
      ],
      outcomes: [
        { 
          id: '1', 
          text: 'Move to New York', 
          ratings: [
            { factorId: '1', rating: 5 },
            { factorId: '2', rating: 2 }
          ]
        },
        { 
          id: '2', 
          text: 'Stay in current city', 
          ratings: [
            { factorId: '1', rating: 3 },
            { factorId: '2', rating: 4 }
          ]
        },
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

    render(await SummaryPage({ params: { id: '1' } }));
    
    // Should find modern summary elements
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Move to New York')).toBeInTheDocument();
    expect(screen.getByText('Stay in current city')).toBeInTheDocument();
  });

  it('should display modern recommendation card', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
      ],
      outcomes: [
        { 
          id: '1', 
          text: 'Move to New York', 
          ratings: [
            { factorId: '1', rating: 5 },
            { factorId: '2', rating: 2 }
          ]
        },
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

    render(await SummaryPage({ params: { id: '1' } }));
    
    // Should find recommendation card with modern styling
    expect(screen.getByText(/Recommended outcome/)).toBeInTheDocument();
  });

  it('should display modern navigation buttons', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
      ],
      outcomes: [
        { 
          id: '1', 
          text: 'Move to New York', 
          ratings: [
            { factorId: '1', rating: 5 },
          ]
        },
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

    render(await SummaryPage({ params: { id: '1' } }));
    
    // Should find modern navigation buttons
    expect(screen.getByText('Back to Decision')).toBeInTheDocument();
    expect(screen.getByText('Adjust Ratings')).toBeInTheDocument();
  });
}); 