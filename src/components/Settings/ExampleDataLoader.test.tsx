import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExampleDataLoader } from './ExampleDataLoader';

jest.mock('../../scripts/populateExampleData');
const mockPopulateExampleData = require('../../scripts/populateExampleData').populateExampleData;

describe('ExampleDataLoader', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card, title, and details toggle', () => {
    render(<ExampleDataLoader />);
    expect(screen.getByRole('heading', { name: /example data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });

  it('expands and collapses details section', async () => {
    render(<ExampleDataLoader />);
    const user = userEvent.setup();
    const toggleBtn = screen.getByRole('button', { name: /show details/i });
    await user.click(toggleBtn);
    expect(screen.getByRole('button', { name: /hide details/i })).toBeInTheDocument();
    // Details content should now be visible (use flexible matcher)
    // Look for a unique substring from the expanded details
    const matches = screen.getAllByText((content, node) => {
      if (!node) return false;
      return node.textContent?.toLowerCase().includes('example clients') || false;
    });
    expect(matches.length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /hide details/i }));
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });

  it('shows loading state and disables button', async () => {
    mockPopulateExampleData.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<ExampleDataLoader />);
    const user = userEvent.setup();
    const loadBtn = screen.getByRole('button', { name: /load example data/i });
    await user.click(loadBtn);
    expect(loadBtn).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows success alert on successful load', async () => {
    mockPopulateExampleData.mockResolvedValue({ success: true });
    render(<ExampleDataLoader />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /load example data/i }));
    expect(await screen.findByText(/example data loaded successfully/i)).toBeInTheDocument();
  });

  it('shows error alert on failed load', async () => {
    mockPopulateExampleData.mockResolvedValue({ success: false, error: 'Some error' });
    render(<ExampleDataLoader />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /load example data/i }));
    expect(await screen.findByText(/some error/i)).toBeInTheDocument();
  });

  it('shows error alert on thrown error', async () => {
    mockPopulateExampleData.mockRejectedValue(new Error('Async fail'));
    render(<ExampleDataLoader />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /load example data/i }));
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      // If test fails, log the alert text for debugging
      // console.log('Alert content:', alert.textContent);
      expect(alert.textContent?.toLowerCase()).toMatch(/(async fail|error|unexpected)/);
    });
  });
});
