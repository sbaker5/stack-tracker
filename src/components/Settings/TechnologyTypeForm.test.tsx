jest.mock('../../firebase/technologyTypes', () => ({
  addTechnologyType: jest.fn(),
  updateTechnologyType: jest.fn().mockResolvedValue({ success: true }),
}));

import React from 'react';
import { addTechnologyType } from '../../firebase/technologyTypes';
(addTechnologyType as jest.Mock).mockResolvedValue({ id: 'mock-id', error: null });
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnologyTypeForm } from './TechnologyTypeForm';

// Mocks (customize as needed for your backend/firebase)
jest.mock('../../firebase/technologyTypes', () => ({
  addTechnologyType: jest.fn().mockResolvedValue({ success: true }),
  updateTechnologyType: jest.fn().mockResolvedValue({ success: true }),
}));

const mockOnSuccess = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  onSuccess: mockOnSuccess,
  onCancel: mockOnCancel,
};

describe('TechnologyTypeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    render(<TechnologyTypeForm {...defaultProps} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/icon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add|save|update/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TechnologyTypeForm {...defaultProps} />);
    const user = userEvent.setup();
    // Debug: log all button text
    screen.getAllByRole('button').forEach(btn => console.log('Button:', btn.textContent));
    // Try clicking the first submit-like button found
    const submitBtn = screen.getAllByRole('button').find(btn =>
      /add|save|update/i.test(btn.textContent || '')
    );
    expect(submitBtn).toBeTruthy();
    await user.click(submitBtn!);
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it('calls onSuccess on successful submit', async () => {
    render(<TechnologyTypeForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/name/i), 'Test Type');
    // Explicitly clear and type value
    const valueInput = screen.getByLabelText(/value/i);
    await user.clear(valueInput);
    await user.type(valueInput, 'test-type');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    // Select icon (if required)
    const iconCombo = screen.getByRole('combobox', { name: /icon/i });
    await user.click(iconCombo);
    const option = await screen.findByRole('option', { name: /cloud/i });
    await user.click(option);
    // Debug: log all button text
    screen.getAllByRole('button').forEach(btn => console.log('Button:', btn.textContent));
    const submitBtn = screen.getAllByRole('button').find(btn =>
      /add|save|update/i.test(btn.textContent || '')
    );
    expect(submitBtn).toBeTruthy();
    await user.click(submitBtn!);
    await waitFor(() => {
      expect(addTechnologyType).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button clicked', async () => {
    render(<TechnologyTypeForm {...defaultProps} />);
    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows error alert on backend error', async () => {
    const { addTechnologyType } = require('../../firebase/technologyTypes');
    addTechnologyType.mockResolvedValueOnce({ success: false, error: 'Backend error' });
    render(<TechnologyTypeForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/name/i), 'Test Type');
    await user.type(screen.getByLabelText(/value/i), 'test-type');
    // Debug: log all button text
    screen.getAllByRole('button').forEach(btn => console.log('Button:', btn.textContent));
    const submitBtn = screen.getAllByRole('button').find(btn =>
      /add|save|update/i.test(btn.textContent || '')
    );
    expect(submitBtn).toBeTruthy();
    await user.click(submitBtn!);
    expect(await screen.findByRole('alert')).toHaveTextContent(/backend error/i);
  });
});
