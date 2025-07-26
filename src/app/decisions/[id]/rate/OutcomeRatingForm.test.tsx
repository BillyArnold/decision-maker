import { render, screen, fireEvent } from '@testing-library/react';
import OutcomeRatingForm from './OutcomeRatingForm';

// Mock the router and actions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({ id: 'test-decision-id' }),
}));

jest.mock('../actions', () => ({
  updateOutcomeRatings: jest.fn(),
}));

describe('OutcomeRatingForm', () => {
  const mockFactors = [
    { id: '1', text: 'Job opportunities', weight: 4 },
    { id: '2', text: 'Cost of living', weight: 3 },
  ];

  const mockOutcomes = [
    { id: '1', text: 'Move to New York', ratings: [] },
    { id: '2', text: 'Stay in current city', ratings: [] },
  ];

  it('should display modern card-based outcome rating sections', () => {
    render(
      <OutcomeRatingForm 
        decisionId="test-decision-id" 
        factors={mockFactors} 
        outcomes={mockOutcomes} 
      />
    );
    
    // Should find outcome cards with modern styling
    expect(screen.getByText('Move to New York')).toBeInTheDocument();
    expect(screen.getByText('Stay in current city')).toBeInTheDocument();
    
    // Should display modern card layout
    const cards = document.querySelectorAll('.bg-white.border.border-gray-200.rounded-xl');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should use RatingButton components for rating selection', () => {
    render(
      <OutcomeRatingForm 
        decisionId="test-decision-id" 
        factors={mockFactors} 
        outcomes={mockOutcomes} 
      />
    );
    
    // Should find rating buttons (1-5) for each factor
    const ratingButtons = screen.getAllByRole('button');
    const ratingValues = ratingButtons.map(button => button.textContent);
    
    // Should contain rating numbers 1-5
    expect(ratingValues).toContain('1');
    expect(ratingValues).toContain('2');
    expect(ratingValues).toContain('3');
    expect(ratingValues).toContain('4');
    expect(ratingValues).toContain('5');
  });

  it('should display modern factor importance indicators', () => {
    render(
      <OutcomeRatingForm 
        decisionId="test-decision-id" 
        factors={mockFactors} 
        outcomes={mockOutcomes} 
      />
    );
    
    // Should find importance indicators
    expect(screen.getByText('Job opportunities')).toBeInTheDocument();
    expect(screen.getByText('Cost of living')).toBeInTheDocument();
    expect(screen.getByText('Importance: 4/5')).toBeInTheDocument();
    expect(screen.getByText('Importance: 3/5')).toBeInTheDocument();
  });
}); 