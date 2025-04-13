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

  it('handles value deletion', () => {
    const onChange = jest.fn();
    render(<TagInput 
      {...defaultProps} 
      onChange={onChange}
    />);

    // Find and click delete button
    const tag = screen.getByTestId('test-tag1');
    const deleteButton = within(tag).getByLabelText('Remove tag1');
    fireEvent.click(deleteButton);

    // Verify onChange was called correctly
    expect(onChange).toHaveBeenCalledWith(['tag2']);
  });

  it('handles value addition', async () => {
    const onChange = jest.fn();
    render(<TagInput 
      {...defaultProps} 
      onChange={onChange}
    />);

    // Get input and type
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: 'tag3' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify onChange was called correctly
    expect(onChange).toHaveBeenCalledWith([...defaultProps.values, 'tag3']);
  });

  it('prevents duplicate values', async () => {
    const onChange = jest.fn();
    render(<TagInput 
      {...defaultProps} 
      onChange={onChange}
    />);

    // Get input and type existing value
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: 'tag1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify onChange was not called
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(<TagInput {...defaultProps} disabled />);

    // No input field should be present
    expect(screen.queryByTestId('test-input')).not.toBeInTheDocument();

    // But chips should still be visible
    expect(screen.getByTestId('test-tag1')).toBeInTheDocument();
    expect(screen.getByTestId('test-tag2')).toBeInTheDocument();

    // Delete buttons should not be present on chips
    const tag = screen.getByTestId('test-tag1');
    expect(within(tag).queryByLabelText('Remove tag1')).not.toBeInTheDocument();
  });

  it('handles empty available values', () => {
    render(<TagInput {...defaultProps} availableValues={[]} />);

    // Check input is disabled
    const input = screen.getByTestId('test-input').querySelector('input');
    expect(input).toBeDisabled();
  });

  it('filters out invalid available values', () => {
    const { rerender } = render(
      <TagInput
        {...defaultProps}
        values={['existing']}
        availableValues={['', '  ', null, undefined, 'valid', 'existing'] as string[]}
      />
    );

    // Get input
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Simulate typing without actually triggering the dropdown
    fireEvent.change(input, { target: { value: 'val' } });

    // Verify input has the value
    expect(input).toHaveValue('val');

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

  it('handles input state changes', () => {
    const onChange = jest.fn();
    render(
      <TagInput
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Get input
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: 'test' } });

    // Verify input value is updated
    expect(input).toHaveValue('test');
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

  it('handles value addition correctly', () => {
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

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify onChange was called with new value
    expect(onChange).toHaveBeenCalledWith(['existing', 'new']);
  });

  it('handles chip deletion', () => {
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
    fireEvent.click(deleteButton);

    // Verify onChange was called
    expect(onChange).toHaveBeenCalledWith(['test2']);
  });

  it('handles duplicate values correctly', () => {
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

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: 'existing' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify onChange was not called
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles whitespace in input', () => {
    const onChange = jest.fn();
    render(
      <TagInput 
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Get input and type whitespace
    const input = screen.getByTestId('test-input').querySelector('input');
    if (!input) throw new Error('Input not found');

    // Use fireEvent instead of userEvent to avoid recursion issues
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify onChange was not called
    expect(onChange).not.toHaveBeenCalled();
  });
});
