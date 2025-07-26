import { render, screen, fireEvent } from '@testing-library/react';
import FactorsForm from './FactorsForm';

// Mock the router and actions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
  useParams: () => ({ id: 'test-decision-id' }),
}));

jest.mock('../app/decisions/[id]/actions', () => ({
  saveFactors: jest.fn(),
}));

describe('FactorsForm', () => {
  it('should display modern card-based factor items', () => {
    const mockFactors = [
      { id: '1', text: 'Job opportunities', weight: 4 },
      { id: '2', text: 'Cost of living', weight: 3 },
    ];

    render(<FactorsForm initialFactors={mockFactors} />);
    
    // Should find factor cards with modern styling
    const factorCards = screen.getAllByText(/Job opportunities|Cost of living/);
    expect(factorCards).toHaveLength(2);
    
    // Should display rating buttons instead of radio buttons
    const ratingButtons = screen.getAllByRole('button');
    expect(ratingButtons.length).toBeGreaterThan(0);
  });

  it('should use RatingButton components for importance selection', () => {
    const mockFactors = [
      { id: '1', text: 'Job opportunities', weight: null },
    ];

    render(<FactorsForm initialFactors={mockFactors} />);
    
    // Should find rating buttons (1-5) for importance selection
    const ratingButtons = screen.getAllByRole('button');
    const ratingValues = ratingButtons.map(button => button.textContent);
    
    // Should contain rating numbers 1-5
    expect(ratingValues).toContain('1');
    expect(ratingValues).toContain('2');
    expect(ratingValues).toContain('3');
    expect(ratingValues).toContain('4');
    expect(ratingValues).toContain('5');
  });
}); 