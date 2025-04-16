import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientsList } from './ClientsList';

// Mock hooks and Firebase
jest.mock('../../hooks/useClients');
jest.mock('../../firebase/clients');

const mockUseClients = require('../../hooks/useClients');
const mockDeleteClient = require('../../firebase/clients');

describe('ClientsList', () => {
  const mockClients = [
    { id: '1', name: 'Acme Corporation', tags: ['finance'], flags: [], notes: '', createdAt: '', updatedAt: '' },
    { id: '2', name: 'Globex Industries', tags: ['tech'], flags: [], notes: '', createdAt: '', updatedAt: '' },
  ];
  const defaultProps = {
    selectedClientId: '1',
    onClientSelect: jest.fn(),
  };

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders client list', () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    render(<ClientsList {...defaultProps} />);
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('Globex Industries')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseClients.useClients.mockReturnValue({ clients: [], loading: true, error: null });
    render(<ClientsList {...defaultProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseClients.useClients.mockReturnValue({ clients: [], loading: false, error: 'Error!' });
    render(<ClientsList {...defaultProps} />);
    expect(screen.getByText(/error!/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    mockUseClients.useClients.mockReturnValue({ clients: [], loading: false, error: null });
    render(<ClientsList {...defaultProps} />);
    expect(screen.getByText(/no clients/i)).toBeInTheDocument();
  });

  it('calls onClientSelect when a client is selected', async () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    render(<ClientsList {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('radio', { name: /Globex Industries/i }));
    expect(defaultProps.onClientSelect).toHaveBeenCalledWith('2');
  });

  it('shows add client form when add button is clicked', async () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    render(<ClientsList {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add client/i }));
    expect(screen.getByText(/add new client/i)).toBeInTheDocument();
  });

  it('shows edit client form when edit button is clicked', async () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    render(<ClientsList {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByLabelText(/edit/i)[0]);
    expect(screen.getByText(/edit client/i)).toBeInTheDocument();
  });

  it('handles client deletion (success)', async () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    mockDeleteClient.deleteClient.mockResolvedValue({ success: true });
    render(<ClientsList {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByLabelText(/delete/i)[0]);
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(mockDeleteClient.deleteClient).toHaveBeenCalledWith('1');
    });
  });

  it('handles client deletion (error)', async () => {
    mockUseClients.useClients.mockReturnValue({ clients: mockClients, loading: false, error: null });
    mockDeleteClient.deleteClient.mockResolvedValue({ success: false, error: 'Delete failed' });
    render(<ClientsList {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getAllByLabelText(/delete/i)[0]);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
    });
  });
});
