import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClientStack } from './ClientStack';

// Mock hooks and dependencies
jest.mock('../../hooks/useClients', () => ({
  useClient: () => ({
    client: null,
    technologies: [],
    loading: true,
    error: null,
  }),
}));
jest.mock('../../hooks/useTechnologyTypes', () => ({
  useTechnologyTypes: () => ({ techTypes: [] }),
}));

// Basic smoke test
describe('ClientStack', () => {
  it('renders instructional message when clientId is null', () => {
    render(<ClientStack clientId={null} />);
    expect(screen.getByText(/please select a client from the clients tab/i)).toBeInTheDocument();
  });

  it('shows error when error is present', () => {
    const useClient = require('../../hooks/useClients').useClient;
    jest.spyOn(require('../../hooks/useClients'), 'useClient').mockReturnValue({
      client: null,
      technologies: [],
      loading: false,
      error: 'Test error',
    });
    render(<ClientStack clientId={'some-client'} />);
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
    // Restore the mock for other tests
    useClient.mockRestore && useClient.mockRestore();
  });
});
