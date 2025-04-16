import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TechnologyForm } from './TechnologyForm';

// Mock props and dependencies
const mockOnSuccess = jest.fn();
const mockOnCancel = jest.fn();

jest.mock('../../hooks/useTechnologyTypes', () => ({
  useTechnologyTypes: () => ({ techTypes: [] }),
}));

jest.mock('../../firebase/clients', () => ({
  addTechnology: jest.fn().mockResolvedValue({ success: true }),
  updateTechnology: jest.fn().mockResolvedValue({ success: true }),
}));

describe('TechnologyForm', () => {
  it('renders without crashing', () => {
    render(
      <TechnologyForm clientId="test-client" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add|save|update/i })).toBeInTheDocument();
  });

  it('shows validation error if required fields are empty', async () => {
    render(
      <TechnologyForm clientId="test-client" onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    );
    fireEvent.click(screen.getByRole('button', { name: /add|save|update/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
});
