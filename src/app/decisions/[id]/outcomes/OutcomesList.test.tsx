import { render, screen, fireEvent } from '@testing-library/react';
import OutcomesList from './OutcomesList';

// Mock the router and actions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
  useParams: () => ({ id: 'test-decision-id' }),
}));

jest.mock('../actions', () => ({
  addOutcome: jest.fn(),
  deleteOutcome: jest.fn(),
}));

describe('OutcomesList', () => {
  it('should display modern card-based outcome items', () => {
    const mockOutcomes = [
      { id: '1', text: 'Move to New York' },
      { id: '2', text: 'Stay in current city' },
    ];

    render(<OutcomesList outcomes={mockOutcomes} />);
    
    // Should find outcome cards with modern styling
    const outcomeCards = screen.getAllByText(/Move to New York|Stay in current city/);
    expect(outcomeCards).toHaveLength(2);
    
    // Should display modern card layout
    const cards = document.querySelectorAll('.bg-white.border.border-gray-200.rounded-xl');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display modern empty state with icon', () => {
    render(<OutcomesList outcomes={[]} />);
    
    // Should find empty state with modern styling
    expect(screen.getByText('No outcomes yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first outcome.')).toBeInTheDocument();
    
    // Should have modern add button
    expect(screen.getByText('Add an outcome')).toBeInTheDocument();
  });

  it('should display modern add outcome section', () => {
    render(<OutcomesList outcomes={[]} />);
    
    // Should find dashed border add section
    const addSection = document.querySelector('.border-2.border-dashed');
    expect(addSection).toBeInTheDocument();
  });
}); 