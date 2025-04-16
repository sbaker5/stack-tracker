import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientForm } from './ClientForm';

// Patch: Mock TagFlagManager to expose test input for tags/flags
jest.mock('../TagFlagManager/TagFlagManager', () => ({
  TagFlagManager: ({ tags, flags, onTagsChange, onFlagsChange }: any) => (
    <div>
      <input data-testid="tags-input" onChange={e => onTagsChange([e.target.value])} />
      <input data-testid="flags-input" onChange={e => onFlagsChange([e.target.value])} />
      {tags.map((tag: string) => <span key={tag}>{tag}</span>)}
      {flags.map((flag: string) => <span key={flag}>{flag}</span>)}
    </div>
  )
}));

jest.mock('../../firebase/clients');
const mockAddClient = require('../../firebase/clients').addClient;
const mockUpdateClient = require('../../firebase/clients').updateClient;

const defaultProps = {
  onSuccess: jest.fn(),
  onCancel: jest.fn(),
};

describe('ClientForm', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders add form by default', () => {
    render(<ClientForm {...defaultProps} />);
    expect(screen.getByText(/add new client/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add client/i })).toBeInTheDocument();
  });

  it('renders edit form when client prop is provided', () => {
    render(
      <ClientForm
        {...defaultProps}
        client={{ id: '1', name: 'Acme', tags: [], flags: [], industry: 'Technology', description: '', notes: '', createdAt: '', updatedAt: '' }}
      />
    );
    expect(screen.getByText(/edit client/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update client/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ClientForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add client/i }));
    expect(await screen.findByText(/client name is required/i)).toBeInTheDocument();
  });

  it('submits new client successfully', async () => {
    mockAddClient.mockResolvedValue({ id: '123', success: true });
    render(<ClientForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/client name/i), 'Globex');
    await user.click(screen.getByLabelText(/industry/i));
    await user.click(screen.getByRole('option', { name: /technology/i }));
    fireEvent.submit(screen.getByTestId('client-form'));
    await waitFor(() => {
      expect(mockAddClient).toHaveBeenCalled();
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('shows error on failed add', async () => {
    mockAddClient.mockResolvedValue({ success: false, error: 'Add failed' });
    render(<ClientForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/client name/i), 'Globex');
    await user.click(screen.getByLabelText(/industry/i));
    await user.click(screen.getByRole('option', { name: /technology/i }));
    fireEvent.submit(screen.getByTestId('client-form'));
    await waitFor(() => {
      expect(mockAddClient).toHaveBeenCalled();
      expect(screen.getByText(/add failed/i)).toBeInTheDocument();
    });
  });

  it('submits update successfully', async () => {
    mockUpdateClient.mockResolvedValue({ success: true });
    render(
      <ClientForm
        {...defaultProps}
        client={{ id: '1', name: 'Acme', tags: [], flags: [], industry: 'Technology', description: '', notes: '', createdAt: '', updatedAt: '' }}
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/client name/i), ' Updated');
    await user.click(screen.getByLabelText(/industry/i));
    await user.click(screen.getByRole('option', { name: /technology/i }));
    fireEvent.submit(screen.getByTestId('client-form'));
    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalled();
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('shows error on failed update', async () => {
    mockUpdateClient.mockResolvedValue({ success: false, error: 'Update failed' });
    render(
      <ClientForm
        {...defaultProps}
        client={{ id: '1', name: 'Acme', tags: [], flags: [], industry: 'Technology', description: '', notes: '', createdAt: '', updatedAt: '' }}
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/client name/i), ' Updated');
    await user.click(screen.getByLabelText(/industry/i));
    await user.click(screen.getByRole('option', { name: /technology/i }));
    fireEvent.submit(screen.getByTestId('client-form'));
    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalled();
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<ClientForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  // Patch: Mock TagFlagManager to expose test input for tags/flags
  jest.mock('../TagFlagManager/TagFlagManager', () => ({
    TagFlagManager: ({ tags, flags, onTagsChange, onFlagsChange }: any) => (
      <div>
        <input data-testid="tags-input" onChange={e => onTagsChange([e.target.value])} />
        <input data-testid="flags-input" onChange={e => onFlagsChange([e.target.value])} />
        {tags.map((tag: string) => <span key={tag}>{tag}</span>)}
        {flags.map((flag: string) => <span key={flag}>{flag}</span>)}
      </div>
    )
  }));

  it('allows tag and flag selection', async () => {
    render(<ClientForm {...defaultProps} />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId('tags-input'), 'tech');
    expect(screen.getByText('tech')).toBeInTheDocument();
    await user.type(screen.getByTestId('flags-input'), 'VIP');
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });
});
