import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnologyTypeManager } from './TechnologyTypeManager';

// Mock dependencies
jest.mock('../../hooks/useTechnologyTypes');
jest.mock('../../firebase/technologyTypes');
jest.mock('./TechnologyTypeForm', () => ({
  TechnologyTypeForm: (props: any) => (
    <div data-testid="mock-tt-form">
      Mock Form
      <button onClick={() => setTimeout(props.onCancel, 0)}>Close</button>
    </div>
  )
}));

const mockUseTechnologyTypes = require('../../hooks/useTechnologyTypes');
const mockDeleteTechnologyType = require('../../firebase/technologyTypes').deleteTechnologyType;

const fakeTypes = [
  { id: '1', name: 'Frontend', icon: 'code', description: 'UI stuff' },
  { id: '2', name: 'Database', icon: 'storage', description: 'DB stuff' },
];

describe('TechnologyTypeManager', () => {
  it('shows empty state when there are no technology types', () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: [], loading: false, error: null });
    render(<TechnologyTypeManager />);
    expect(screen.getByText(/no technology types/i)).toBeInTheDocument();
  });
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders technology types list', () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: fakeTypes, loading: false, error: null });
    render(<TechnologyTypeManager />);
    expect(screen.getByRole('heading', { name: /technology types/i })).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add type/i })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: [], loading: true, error: null });
    render(<TechnologyTypeManager />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error alert', () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: [], loading: false, error: 'Failed' });
    render(<TechnologyTypeManager />);
    expect(screen.getByRole('alert').textContent).toMatch(/failed/i);
  });

  it('opens and closes add form', async () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: fakeTypes, loading: false, error: null });
    render(<TechnologyTypeManager />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add type/i }));
    expect(screen.getByTestId('mock-tt-form')).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    await waitFor(() => expect(screen.queryByTestId('mock-tt-form')).not.toBeInTheDocument());
  });

  it('opens and closes edit form', async () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: fakeTypes, loading: false, error: null });
    render(<TechnologyTypeManager />);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(screen.getByTestId('mock-tt-form')).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    await waitFor(() => expect(screen.queryByTestId('mock-tt-form')).not.toBeInTheDocument());
  });

  it('handles delete (success and error)', async () => {
    mockUseTechnologyTypes.useTechnologyTypes.mockReturnValue({ techTypes: fakeTypes, loading: false, error: null });
    mockDeleteTechnologyType
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: 'Delete failed' });
    render(<TechnologyTypeManager />);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(mockDeleteTechnologyType).toHaveBeenCalled());
    // Wait for dialog to close and list to update
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // Now simulate error
    mockDeleteTechnologyType.mockResolvedValue({ success: false, error: 'Delete failed' });
    await user.click(screen.getAllByRole('button', { name: /delete/i })[1]);
    // console.log('Clicked second delete button');
    // Wait for dialog to open
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    // Find the confirm button inside the dialog
    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /delete/i });
    await user.click(confirmBtn);
    // console.log('Clicked confirm delete for error path');
    expect(mockDeleteTechnologyType).toHaveBeenCalledTimes(2);
    // screen.debug(); // Debug DOM after failed delete
    // Log dialog state after second delete
    const dialogState = screen.getByRole('dialog').textContent;
    // console.log('Dialog state after error:', dialogState);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await waitFor(() => {
      const alert = within(dialog).getByRole('alert');
      expect(alert).toHaveTextContent(/delete failed/i);
    }, { timeout: 2000 });
    // Note: One successful and one error delete is sufficient for robust coverage.
  });
});
