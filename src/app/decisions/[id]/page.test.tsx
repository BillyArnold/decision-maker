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
  it('should display decision title and modern factors form', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      status: 'In Progress',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
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

    render(await DecisionPage({ params: { id: '1' } }));
    
    expect(screen.getByText('Should I move to a new city?')).toBeInTheDocument();
    expect(screen.getByText('Job opportunities')).toBeInTheDocument();
    expect(screen.getByText('Cost of living')).toBeInTheDocument();
  });

  it('should NOT display summary button on factors page', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      status: 'In Progress',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
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

    render(await DecisionPage({ params: { id: '1' } }));
    
    // This test will fail initially because the summary button is currently present
    expect(screen.queryByText('View Summary')).not.toBeInTheDocument();
  });

  it('should display modern next step button', async () => {
    const mockDecision = {
      id: '1',
      title: 'Should I move to a new city?',
      status: 'In Progress',
      factors: [
        { id: '1', text: 'Job opportunities', weight: 4 },
        { id: '2', text: 'Cost of living', weight: 3 },
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

    render(await DecisionPage({ params: { id: '1' } }));
    
    // Should find modern next step button
    expect(screen.getByText('Next: Possible Outcomes')).toBeInTheDocument();
  });
}); 