import React from 'react';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  const defaultProps = {
    label: 'Test Tags',
    values: ['tag1', 'tag2'],
    availableValues: ['tag1', 'tag2', 'tag3', 'tag4'],
    onChange: jest.fn(),
    testIdPrefix: 'test',
    icon: <LocalOfferIcon />,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders values and label correctly', () => {
    render(<TagInput {...defaultProps} />);

    // Check label
    expect(screen.getByText('Test Tags')).toBeInTheDocument();

    // Check values
    expect(screen.getByTestId('test-tag1')).toBeInTheDocument();
    expect(screen.getByTestId('test-tag2')).toBeInTheDocument();
  });

  it('handles value deletion', async () => {
    const user = userEvent.setup();
    render(<TagInput {...defaultProps} />);

    // Find and click delete button
    const tag = screen.getByTestId('test-tag1');
    const deleteButton = within(tag).getByLabelText('delete');
    await user.click(deleteButton);

    // Verify onChange was called correctly
    expect(defaultProps.onChange).toHaveBeenCalledWith(['tag2']);
  });

  it('handles value addition', async () => {
    const user = userEvent.setup();
    render(<TagInput {...defaultProps} />);

    // Get input and type
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, 'tag3');
      await user.keyboard('{Enter}');
    });

    // Verify onChange was called correctly
    expect(defaultProps.onChange).toHaveBeenCalledWith([...defaultProps.values, 'tag3']);
  });

  it('prevents duplicate values', async () => {
    const user = userEvent.setup();
    render(<TagInput {...defaultProps} />);

    // Get input and type existing value
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, 'tag1');
      await user.keyboard('{Enter}');
    });

    // Verify onChange was not called
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(<TagInput {...defaultProps} disabled />);

    // Check input is disabled
    const input = screen.getByTestId('test-input').querySelector('input');
    expect(input).toBeDisabled();

    // Check delete buttons are not present
    const tag = screen.getByTestId('test-tag1');
    expect(within(tag).queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('handles empty available values', () => {
    render(<TagInput {...defaultProps} availableValues={[]} />);

    // Check input is disabled
    const input = screen.getByTestId('test-input').querySelector('input');
    expect(input).toBeDisabled();
  });

  it('filters out invalid available values', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TagInput
        {...defaultProps}
        values={['existing']}
        availableValues={['', '  ', null, undefined, 'valid', 'existing'] as string[]}
      />
    );

    // Get input and open dropdown
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, 'val');
    });

    // Check only valid option is shown
    const popper = screen.getByTestId('test-autocomplete-popper');
    const options = within(popper).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('valid');

    // Test with undefined availableValues
    rerender(
      <TagInput
        {...defaultProps}
        values={[]}
        availableValues={[]}
      />
    );

    // Verify input is disabled
    const newInput = screen.getByTestId('test-input').querySelector('input');
    expect(newInput).toBeDisabled();
  });

  it('handles input state changes', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TagInput
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Get input and type
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Test input change
    await act(async () => {
      await user.type(input, 'test');
    });

    // Verify input value is updated
    expect(input.value).toBe('test');
  });

  it('handles null/undefined values', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <TagInput
        {...defaultProps}
        values={undefined as unknown as string[]}
        availableValues={undefined as unknown as string[]}
        onChange={onChange}
      />
    );

    // Verify component renders without errors
    expect(screen.getByTestId('test-input')).toBeInTheDocument();

    // Test with null values
    rerender(
      <TagInput
        {...defaultProps}
        values={null as unknown as string[]}
        availableValues={null as unknown as string[]}
        onChange={onChange}
      />
    );

    // Verify component still renders
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('handles value addition correctly', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TagInput
        {...defaultProps}
        values={['existing']}
        availableValues={['new', 'existing']}
        onChange={onChange}
      />
    );

    // Add new value
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, 'new');
      await user.keyboard('{Enter}');
    });

    // Verify onChange was called with new value
    expect(onChange).toHaveBeenCalledWith(['existing', 'new']);
    expect(input.value).toBe('');
  });

  it('handles chip deletion', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TagInput
        {...defaultProps}
        values={['test1', 'test2']}
        onChange={onChange}
      />
    );

    // Find and click delete button
    const chip = screen.getByTestId('test-test1');
    const deleteButton = within(chip).getByLabelText('Remove test1');
    await user.click(deleteButton);

    // Verify onChange was called
    expect(onChange).toHaveBeenCalledWith(['test2']);
  });

  it('handles duplicate values correctly', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TagInput
        {...defaultProps}
        values={['existing']}
        availableValues={['new', 'existing']}
        onChange={onChange}
      />
    );

    // Try to add existing value
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, 'existing');
      await user.keyboard('{Enter}');
    });

    // Verify onChange was not called
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles whitespace in input', async () => {
    const user = userEvent.setup();
    render(<TagInput {...defaultProps} />);

    // Get input and type whitespace
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      await user.type(input, '   ');
      await user.keyboard('{Enter}');
    });

    // Verify onChange was not called
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
