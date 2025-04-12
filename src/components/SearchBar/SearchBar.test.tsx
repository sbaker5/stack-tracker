import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar, SearchResult } from './SearchBar';

describe('SearchBar', () => {
  const mockResults: SearchResult[] = [
    { id: '1', name: 'Acme Corp', type: 'client' },
    { id: '2', name: 'Palo Alto', type: 'technology', category: 'Security' },
    { id: '3', name: 'finance', type: 'tag' },
  ];

  const defaultProps = {
    onSearch: jest.fn().mockResolvedValue(mockResults),
    onResultSelect: jest.fn(),
    debounceMs: 0, // Disable debounce in tests
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Search clients, technologies, or tags...'
    );
  });

  it('shows search icon', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('calls onSearch when typing more than minSearchLength characters', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} minSearchLength={2} />);

    // Type a single character (shouldn't trigger search)
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'a');
    expect(defaultProps.onSearch).not.toHaveBeenCalled();

    // Type another character (should trigger search)
    await user.type(searchInput, 'c');
    expect(defaultProps.onSearch).toHaveBeenCalledWith('ac');
  });

  it('displays search results with proper formatting', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    // Type search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    // Wait for results container
    const resultsContainer = await screen.findByTestId('search-results-container');
    expect(resultsContainer).toBeInTheDocument();

    // Check result items
    const acmeResult = await screen.findByTestId('search-result-1');
    expect(acmeResult).toHaveTextContent('Acme Corp');
    expect(acmeResult).toHaveTextContent('client');

    const paloAltoResult = await screen.findByTestId('search-result-2');
    expect(paloAltoResult).toHaveTextContent('Palo Alto');
    expect(paloAltoResult).toHaveTextContent('Security');
    expect(paloAltoResult).toHaveTextContent('technology');
  });

  it('calls onResultSelect when clicking a result', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    // Type search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    // Wait for and click a result
    const acmeResult = await screen.findByTestId('search-result-1');
    await user.click(acmeResult);

    // Verify callback
    expect(defaultProps.onResultSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it('handles search errors gracefully', async () => {
    const errorProps = {
      ...defaultProps,
      onSearch: jest.fn().mockRejectedValue(new Error('Search failed')),
    };

    const user = userEvent.setup();
    const { rerender } = render(<SearchBar {...errorProps} />);

    // Type search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    // Wait for error to be handled
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Force a rerender to update state
    rerender(<SearchBar {...errorProps} />);

    // Verify no options are shown
    expect(screen.queryByText('No options')).toBeInTheDocument();
  });

  it('clears input after selecting a result', async () => {
    const user = userEvent.setup();
    const mockOnResultSelect = jest.fn();
    render(<SearchBar {...defaultProps} onResultSelect={mockOnResultSelect} />);

    // Type search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    // Wait for and click a result
    const acmeResult = await screen.findByTestId('search-result-1');
    await user.click(acmeResult);

    // Verify callback was called
    expect(mockOnResultSelect).toHaveBeenCalledWith(mockResults[0]);

    // Wait for input to be cleared
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Get input again after state update
    const updatedInput = screen.getByTestId('search-input');
    expect(updatedInput).toHaveValue('');
  });

  it('respects custom placeholder text', () => {
    const customPlaceholder = 'Custom search placeholder';
    render(<SearchBar {...defaultProps} placeholder={customPlaceholder} />);
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveAttribute('placeholder', customPlaceholder);
  });

  it('respects custom debounce time', async () => {
    const customDebounce = 500;
    const user = userEvent.setup();
    
    render(<SearchBar {...defaultProps} debounceMs={customDebounce} />);

    // Type search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    // Verify search not called immediately
    expect(defaultProps.onSearch).not.toHaveBeenCalled();

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, customDebounce + 100));
    });

    // Verify search called after debounce
    expect(defaultProps.onSearch).toHaveBeenCalledWith('test');
  });
});
