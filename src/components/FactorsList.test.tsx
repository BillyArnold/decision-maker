import { render, screen, fireEvent } from '@testing-library/react';
import FactorsList from './FactorsList';

// Mock the server action
jest.mock('../app/decisions/[id]/actions', () => ({
  addFactor: jest.fn(),
  deleteFactor: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-decision-id' }),
  useRouter: () => ({ refresh: jest.fn() }),
}));

describe('FactorsList', () => {
  it('should display delete button for each factor', () => {
    const mockFactors = [
      { id: '1', text: 'Job opportunities' },
      { id: '2', text: 'Cost of living' },
    ];

    render(<FactorsList factors={mockFactors} />);
    
    // Should find delete buttons (trash icons) for each factor
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call deleteFactor when delete button is clicked', () => {
    const mockFactors = [
      { id: '1', text: 'Job opportunities' },
    ];

    const { deleteFactor } = require('../app/decisions/[id]/actions');
    
    render(<FactorsList factors={mockFactors} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(deleteFactor).toHaveBeenCalledWith('test-decision-id', '1');
  });
}); 