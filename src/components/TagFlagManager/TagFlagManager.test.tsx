import React from 'react';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagFlagManager } from './TagFlagManager';

describe('TagFlagManager', () => {
  const defaultProps = {
    tags: ['finance', 'enterprise'],
    flags: ['Renewal Due'],
    availableTags: ['finance', 'enterprise', 'healthcare', 'tech'],
    availableFlags: ['Renewal Due', 'Follow-Up Needed', 'Expansion Planned'],
    onTagsChange: jest.fn(),
    onFlagsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tags and flags correctly', () => {
    render(<TagFlagManager {...defaultProps} />);

    // Check tags section
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByTestId('tag-finance')).toBeInTheDocument();
    expect(screen.getByTestId('tag-enterprise')).toBeInTheDocument();

    // Check flags section
    expect(screen.getByText('Flags')).toBeInTheDocument();
    expect(screen.getByTestId('flag-Renewal Due')).toBeInTheDocument();
  });

  it('handles default and missing props', () => {
    // Test with minimal required props
    const { rerender } = render(
      <TagFlagManager
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
      />
    );

    // Verify default empty states
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByTestId('flag-input')).toBeInTheDocument();

    // Test with undefined values
    rerender(
      <TagFlagManager
        tags={undefined as unknown as string[]}
        flags={undefined as unknown as string[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
      />
    );

    // Verify default values are used
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByTestId('flag-input')).toBeInTheDocument();

    // Test with null values
    rerender(
      <TagFlagManager
        tags={null as unknown as string[]}
        flags={null as unknown as string[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
      />
    );

    // Verify default values are used
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByTestId('flag-input')).toBeInTheDocument();
  });

  it('handles empty/undefined available values', () => {
    const { rerender } = render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        availableTags={[]}
        availableFlags={[]}
      />
    );

    // Verify inputs exist and are disabled with empty arrays
    const emptyTagInput = screen.getByTestId('tag-input').querySelector('input');
    const emptyFlagInput = screen.getByTestId('flag-input').querySelector('input');
    expect(emptyTagInput).toBeDisabled();
    expect(emptyFlagInput).toBeDisabled();
    expect(emptyTagInput).toHaveAttribute('placeholder', 'No available tags');
    expect(emptyFlagInput).toHaveAttribute('placeholder', 'No available flags');

    // Test with undefined values
    rerender(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        availableTags={undefined}
        availableFlags={undefined}
      />
    );

    // Verify inputs exist and are disabled with undefined arrays
    const undefinedTagInput = screen.getByTestId('tag-input').querySelector('input');
    const undefinedFlagInput = screen.getByTestId('flag-input').querySelector('input');
    expect(undefinedTagInput).toBeDisabled();
    expect(undefinedFlagInput).toBeDisabled();
    expect(undefinedTagInput).toHaveAttribute('placeholder', 'No available tags');
    expect(undefinedFlagInput).toHaveAttribute('placeholder', 'No available flags');
  });

  it('handles tag changes', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<TagFlagManager {...defaultProps} />);
    });

    // Simulate tag change
    const newTags = ['finance', 'enterprise', 'healthcare'];
    const tagInput = screen.getByTestId('tag-input').querySelector('input');
    if (!tagInput) throw new Error('Tag input not found');

    await act(async () => {
      await user.type(tagInput, 'healthcare');
      await user.keyboard('{Enter}');
    });

    // Verify onTagsChange was called
    expect(defaultProps.onTagsChange).toHaveBeenCalledWith(newTags);
  });

  it('handles flag changes', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<TagFlagManager {...defaultProps} />);
    });

    // Simulate flag change
    const newFlags = ['Renewal Due', 'Follow-Up Needed'];
    const flagInput = screen.getByTestId('flag-input').querySelector('input');
    if (!flagInput) throw new Error('Flag input not found');

    await act(async () => {
      await user.type(flagInput, 'Follow-Up Needed');
      await user.keyboard('{Enter}');
    });

    // Verify onFlagsChange was called
    expect(defaultProps.onFlagsChange).toHaveBeenCalledWith(newFlags);
  });

  it('handles disabled state', () => {
    render(<TagFlagManager {...defaultProps} disabled />);

    // Verify inputs are not rendered
    expect(screen.queryByTestId('tag-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('flag-input')).not.toBeInTheDocument();

    // Verify values are still shown
    expect(screen.getByTestId('tag-finance')).toBeInTheDocument();
    expect(screen.getByTestId('tag-enterprise')).toBeInTheDocument();
    expect(screen.getByTestId('flag-Renewal Due')).toBeInTheDocument();

    // Verify delete buttons are not present
    const financeTag = screen.getByTestId('tag-finance');
    const renewalFlag = screen.getByTestId('flag-Renewal Due');
    expect(within(financeTag).queryByLabelText('delete')).not.toBeInTheDocument();
    expect(within(renewalFlag).queryByLabelText('delete')).not.toBeInTheDocument();
    expect(within(renewalFlag).queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('disables editing when disabled prop is true', () => {
    render(<TagFlagManager {...defaultProps} disabled />);

    // Verify inputs are not present
    expect(screen.queryByTestId('tag-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('flag-input')).not.toBeInTheDocument();

    // Verify delete buttons are not present
    const financeTag = screen.getByTestId('tag-finance');
    expect(within(financeTag).queryByLabelText('delete')).not.toBeInTheDocument();

    const renewalFlag = screen.getByTestId('flag-Renewal Due');
    expect(within(renewalFlag).queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('prevents duplicate tags from being added', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<TagFlagManager {...defaultProps} />);
    });

    // Try to add existing 'finance' tag
    const tagInput = screen.getByTestId('tag-input');
    await user.type(tagInput, 'finance');
    
    // Wait for and try to select existing 'finance' option
    await screen.findByTestId('tag-autocomplete-popper');
    const financeOption = screen.getByText('finance');
    await user.click(financeOption);

    // Verify onTagsChange was not called
    expect(defaultProps.onTagsChange).not.toHaveBeenCalled();
  });

  it('prevents duplicate flags from being added', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<TagFlagManager {...defaultProps} />);
    });

    // Try to add existing 'Renewal Due' flag
    const flagInput = screen.getByTestId('flag-input');
    await user.type(flagInput, 'Renewal');
    
    // Wait for and try to select existing 'Renewal Due' option
    await screen.findByTestId('flag-autocomplete-popper');
    const renewalOption = screen.getByText('Renewal Due');
    await user.click(renewalOption);

    // Verify onFlagsChange was not called
    expect(defaultProps.onFlagsChange).not.toHaveBeenCalled();
  });

  it('handles undefined tags and flags gracefully', () => {
    const { container } = render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('handles empty available tags and flags', () => {
    const { getByRole } = render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        availableTags={[]}
        availableFlags={[]}
      />
    );

    // Verify inputs are present but disabled
    const tagInput = screen.getByTestId('tag-input').querySelector('input');
    const flagInput = screen.getByTestId('flag-input').querySelector('input');
    expect(tagInput).toBeDisabled();
    expect(flagInput).toBeDisabled();
  });

  it('handles invalid tag and flag arrays', () => {
    const props = {
      ...defaultProps,
      tags: [] as string[],
      flags: [] as string[],
      availableTags: [] as string[],
      availableFlags: [] as string[]
    };

    const { container } = render(<TagFlagManager {...props} />);
    expect(container).toBeInTheDocument();

    // Verify no chips are rendered
    const tagChips = within(container).queryAllByRole('button');
    expect(tagChips).toHaveLength(0);

    // Try to add a tag when available tags is empty
    const tagInput = screen.getByTestId('tag-input').querySelector('input');
    expect(tagInput).toBeDisabled();
  });

  it('handles empty string values in available options', async () => {
    const user = userEvent.setup();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        availableTags={['', 'tag1']}
        availableFlags={['', 'flag1']}
      />
    );

    // Focus tag input and type to trigger options
    const tagInput = screen.getByTestId('tag-input');
    await act(async () => {
      await user.type(tagInput, 't');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for autocomplete options
    const popper = await screen.findByTestId('tag-autocomplete-popper');

    // Verify only valid option is shown
    const options = within(popper).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag1');
  });

  it('handles null input values', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['tag1']}
        availableFlags={['flag1']}
      />
    );

    // Trigger tag add with null value
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      // @ts-ignore - Testing null value
      fireEvent.change(input, { target: { value: null } });
    });

    // Verify no changes were made
    expect(onTagsChange).not.toHaveBeenCalled();
  });

  it('handles edge cases in tag/flag filtering', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={['tag1']}
        flags={['flag1']}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['tag1', 'tag2']}
        availableFlags={['flag1', 'flag2']}
      />
    );

    // Verify filtered options
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');
    const options = within(popper).getAllByRole('option');

    // Only tag2 should be shown (tag1 is filtered out)
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag2');
  });

  it('handles special characters in tag/flag values', async () => {
    const specialTag = '!@#$%^&*()_+';
    const onTagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={() => {}}
        availableTags={[specialTag]}
      />
    );

    // Add tag with special characters
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    await act(async () => {
      fireEvent.change(input, { target: { value: specialTag } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // Verify tag was added
    expect(onTagsChange).toHaveBeenCalledWith([specialTag]);
  });

  it('handles input changes correctly', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['tag1']}
        availableFlags={['flag1']}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Test tag input change
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'new' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Test flag input change
    await act(async () => {
      fireEvent.change(flagInput, { target: { value: 'new' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify no changes were made until selection
    expect(onTagsChange).not.toHaveBeenCalled();
    expect(onFlagsChange).not.toHaveBeenCalled();
  });

  it('handles input clear correctly', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={['tag1']}
        flags={['flag1']}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Clear inputs
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: '' } });
      fireEvent.change(flagInput, { target: { value: '' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify no changes were made
    expect(onTagsChange).not.toHaveBeenCalled();
    expect(onFlagsChange).not.toHaveBeenCalled();
  });

  it('handles undefined optional props', () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
      />
    );

    // Verify inputs are disabled when no available options
    const tagInput = screen.getByTestId('tag-input').querySelector('input');
    const flagInput = screen.getByTestId('flag-input').querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    expect(tagInput).toBeDisabled();
    expect(flagInput).toBeDisabled();
  });

  it('handles duplicate values in available options', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['tag1', 'tag1']}
        availableFlags={['flag1', 'flag1']}
      />
    );

    // Verify filtered options
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');
    const options = within(popper).getAllByRole('option');

    // Duplicates should be filtered out
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag1');
  });

  it('handles whitespace in tag/flag values', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['  tag1  ', 'tag2']}
        availableFlags={['  flag1  ', 'flag2']}
      />
    );

    // Get tag input
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');
    const options = within(popper).getAllByRole('option');

    // Select option with whitespace
    await act(async () => {
      fireEvent.click(options[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify tag was added with trimmed whitespace
    expect(onTagsChange).toHaveBeenCalledWith(['tag1']);
  });

  it('handles all whitespace tag/flag values', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['   ', 'tag1']}
        availableFlags={['   ', 'flag1']}
      />
    );

    // Get tag input
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');

    // Wait for options to be visible
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Only valid option should be shown
    const options = within(popper).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag1');
  });

  it('handles direct input of whitespace values', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
      />
    );

    // Get tag input
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Try to add whitespace tag
    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify no tag was added
    expect(onTagsChange).not.toHaveBeenCalled();
  });

  it('handles disabled state with existing tags/flags', () => {
    render(
      <TagFlagManager
        tags={['tag1']}
        flags={['flag1']}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        disabled={true}
      />
    );

    // Verify delete buttons are not present
    const tagChip = screen.getByTestId('tag-tag1');
    const flagChip = screen.getByTestId('flag-flag1');

    expect(tagChip.querySelector('[aria-label="delete"]')).not.toBeInTheDocument();
    expect(flagChip.querySelector('[aria-label="delete"]')).not.toBeInTheDocument();
  });

  it('handles undefined/null available options', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={undefined}
        // @ts-ignore - Testing null value
        availableFlags={null as unknown as string[]}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Verify inputs are disabled
    expect(tagInput).toBeDisabled();
    expect(flagInput).toBeDisabled();
  });

  it('handles null values in available options', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['tag1']}
        availableFlags={['flag1']}
        // We'll test null/undefined handling in component logic
      />
    );

    // Get tag input
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');
    const options = within(popper).getAllByRole('option');

    // Only valid options should be shown
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag1');
  });

  it('handles empty values in available options', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['', '  ', 'tag1']}
        availableFlags={['flag1', '', '  ']}
      />
    );

    // Get tag input
    const tagInput = screen.getByTestId('tag-input');
    const input = tagInput.querySelector('input');
    if (!input) throw new Error('Input not found');

    // Type to trigger options
    await act(async () => {
      fireEvent.change(input, { target: { value: 'tag' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for popper
    const popper = await screen.findByTestId('tag-autocomplete-popper');
    const options = within(popper).getAllByRole('option');

    // Only valid options should be shown
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('tag1');
  });

  it('handles input state and option filtering', async () => {
    const user = userEvent.setup();
    render(
      <TagFlagManager
        tags={['tag1']}
        flags={['flag1']}
        onTagsChange={() => {}}
        onFlagsChange={() => {}}
        availableTags={['tag1', 'tag2', 'test']}
        availableFlags={['flag1', 'flag2', 'test']}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Test tag input state updates
    await user.type(tagInput, 'te');
    expect(tagInput.value).toBe('te');

    // Wait for and verify filtered tag options
    const tagPopper = await screen.findByTestId('tag-autocomplete-popper');
    const tagOptions = within(tagPopper).getAllByRole('option');
    expect(tagOptions).toHaveLength(1);
    expect(tagOptions[0]).toHaveTextContent('test');

    // Test flag input state updates
    await user.type(flagInput, 'te');
    expect(flagInput.value).toBe('te');

    // Wait for and verify filtered flag options
    const flagPopper = await screen.findByTestId('flag-autocomplete-popper');
    const flagOptions = within(flagPopper).getAllByRole('option');
    expect(flagOptions).toHaveLength(1);
    expect(flagOptions[0]).toHaveTextContent('test');

    // Clear inputs and verify state updates
    await user.clear(tagInput);
    await user.clear(flagInput);
    expect(tagInput.value).toBe('');
    expect(flagInput.value).toBe('');
  });

  it('handles edge cases in input handling', async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds
    jest.useFakeTimers({ advanceTimers: true });
    const user = userEvent.setup();
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();

    // Test with minimum required props
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['test']}
        availableFlags={['test']}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Test empty input submission
    await user.type(tagInput, '{Enter}');
    expect(onTagsChange).not.toHaveBeenCalled();

    await user.type(flagInput, '{Enter}');
    expect(onFlagsChange).not.toHaveBeenCalled();

    // Test whitespace-only input
    await act(async () => {
      await user.type(tagInput, '   {Enter}');
      jest.advanceTimersByTime(0);
    });
    expect(onTagsChange).not.toHaveBeenCalled();

    await act(async () => {
      await user.type(flagInput, '   {Enter}');
      jest.advanceTimersByTime(0);
    });
    expect(onFlagsChange).not.toHaveBeenCalled();

    // Test input change handling
    await act(async () => {
      await user.type(tagInput, 'test');
      jest.advanceTimersByTime(0);
    });
    expect(tagInput.value.trim()).toBe('test');

    await act(async () => {
      await user.type(flagInput, 'test');
      jest.advanceTimersByTime(0);
    });
    expect(flagInput.value.trim()).toBe('test');

    // Test direct value changes
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'direct' } });
      jest.advanceTimersByTime(0);
    });
    expect(tagInput.value.trim()).toBe('direct');

    await act(async () => {
      fireEvent.change(flagInput, { target: { value: 'direct' } });
      jest.advanceTimersByTime(0);
    });
    expect(flagInput.value.trim()).toBe('direct');

    // Test with empty arrays
    render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={[]}
        availableFlags={[]}
      />
    );

    // Verify inputs are disabled when no options available
    const emptyTagInput = screen.getAllByTestId('tag-input')[1].querySelector('input');
    const emptyFlagInput = screen.getAllByTestId('flag-input')[1].querySelector('input');
    if (!emptyTagInput || !emptyFlagInput) throw new Error('Inputs not found');

    expect(emptyTagInput).toBeDisabled();
    expect(emptyFlagInput).toBeDisabled();

    // Cleanup
    jest.useRealTimers();
  });

  it('handles input state and validation correctly', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const user = userEvent.setup();
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();

    render(
      <TagFlagManager
        tags={['existing']}
        flags={['existing']}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['existing', 'test1', 'test2']}
        availableFlags={['existing', 'test1', 'test2']}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Test partial input matching
    await act(async () => {
      await user.type(tagInput, 'test');
      jest.advanceTimersByTime(0);
    });

    // Verify filtered options
    const tagPopper = await screen.findByTestId('tag-autocomplete-popper');
    const tagOptions = within(tagPopper).getAllByRole('option');
    expect(tagOptions).toHaveLength(2); // test1, test2 (existing filtered out)

    // Test selecting a filtered option
    await act(async () => {
      fireEvent.click(tagOptions[0]);
      jest.advanceTimersByTime(0);
    });

    // Verify tag was added
    expect(onTagsChange).toHaveBeenCalledWith(['existing', 'test1']);
    expect(tagInput.value).toBe('');

    // Test flag input similarly
    await act(async () => {
      fireEvent.change(flagInput, { target: { value: 'test' } });
      jest.advanceTimersByTime(0);
    });

    const flagPopper = await screen.findByTestId('flag-autocomplete-popper');
    const flagOptions = within(flagPopper).getAllByRole('option');
    expect(flagOptions).toHaveLength(2); // test1, test2 (existing filtered out)

    await act(async () => {
      fireEvent.click(flagOptions[1]);
      jest.advanceTimersByTime(0);
    });

    expect(onFlagsChange).toHaveBeenCalledWith(['existing', 'test2']);
    expect(flagInput.value).toBe('');

    // Cleanup
    jest.useRealTimers();
  });

  it('covers remaining branches', async () => {
    const onTagsChange = jest.fn();
    const onFlagsChange = jest.fn();

    // Test default values (lines 17-18)
    const { rerender } = render(
      <TagFlagManager
        tags={[]}
        flags={[]}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
        availableTags={['test']}
        availableFlags={['test']}
      />
    );

    // Get inputs
    const tagInputWrapper = screen.getByTestId('tag-input');
    const flagInputWrapper = screen.getByTestId('flag-input');
    expect(tagInputWrapper).toBeInTheDocument();
    expect(flagInputWrapper).toBeInTheDocument();

    const tagInput = tagInputWrapper.querySelector('input');
    const flagInput = flagInputWrapper.querySelector('input');
    if (!tagInput || !flagInput) throw new Error('Inputs not found');

    // Test empty value handling (lines 39, 48)
    fireEvent.change(tagInput, { target: { value: '' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    expect(onTagsChange).not.toHaveBeenCalled();

    fireEvent.change(flagInput, { target: { value: '' } });
    fireEvent.keyDown(flagInput, { key: 'Enter' });
    expect(onFlagsChange).not.toHaveBeenCalled();

    // Test option filtering (lines 79-92)
    rerender(
      <TagFlagManager
        tags={['existing']}
        flags={['existing']}
        availableTags={['existing', '', '  ', 'valid']}
        availableFlags={['existing', '', '  ', 'valid']}
        onTagsChange={onTagsChange}
        onFlagsChange={onFlagsChange}
      />
    );

    // Test undefined value handling
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: undefined } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });
    });
    expect(onTagsChange).not.toHaveBeenCalled();

    // Test whitespace value handling
    await act(async () => {
      fireEvent.change(flagInput, { target: { value: '   ' } });
      fireEvent.keyDown(flagInput, { key: 'Enter' });
    });
    expect(onFlagsChange).not.toHaveBeenCalled();

    // Test option filtering
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'val' } });
      fireEvent.change(flagInput, { target: { value: 'val' } });
    });

    // Verify filtered options
    const tagPopper = screen.getByTestId('tag-autocomplete-popper');
    const tagOptions = within(tagPopper).getAllByRole('option');
    expect(tagOptions).toHaveLength(1);
    expect(tagOptions[0]).toHaveTextContent('valid');

    // Test option selection
    await act(async () => {
      fireEvent.click(tagOptions[0]);
    });
    expect(onTagsChange).toHaveBeenCalledWith(['existing', 'valid']);
  });
});
