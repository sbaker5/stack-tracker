import React from 'react';
import { Box } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { TagInput } from './TagInput';

/**
 * Props for the TagFlagManager component
 *
 * @interface TagFlagManagerProps
 * @property {string[]} [tags] - Currently selected tags
 * @property {string[]} [flags] - Currently selected flags
 * @property {string[]} [availableTags] - List of available tags for autocomplete
 * @property {string[]} [availableFlags] - List of available flags for autocomplete
 * @property {(newTags: string[]) => void} onTagsChange - Callback when tags change
 * @property {(newFlags: string[]) => void} onFlagsChange - Callback when flags change
 * @property {boolean} [disabled] - Disables all interactions
 */
export interface TagFlagManagerProps {
  tags?: string[];
  flags?: string[];
  availableTags?: string[];
  availableFlags?: string[];
  onTagsChange: (newTags: string[]) => void;
  onFlagsChange: (newFlags: string[]) => void;
  disabled?: boolean;
}

/**
 * A flexible React component for managing tags and flags with autocomplete support.
 * 
 * Features:
 * - Manage both tags and flags with a unified interface
 * - Autocomplete suggestions from available values
 * - Handles disabled states gracefully
 * - Full keyboard navigation support
 * - Screen reader friendly
 * - Prevents duplicate entries
 * - Input validation and whitespace trimming
 *
 * @component
 * @example
 * ```tsx
 * <TagFlagManager
 *   tags={['react']}
 *   flags={['urgent']}
 *   availableTags={['react', 'typescript']}
 *   availableFlags={['urgent', 'in-progress']}
 *   onTagsChange={setTags}
 *   onFlagsChange={setFlags}
 * />
 * ```
 */
export const TagFlagManager: React.FC<TagFlagManagerProps> = ({
  tags = [],
  flags = [],
  availableTags = [],
  availableFlags = [],
  onTagsChange,
  onFlagsChange,
  disabled = false,
}) => {
  return (
    <Box className="space-y-4">
      <TagInput
        label="Tags"
        values={tags}
        availableValues={availableTags}
        onChange={onTagsChange}
        disabled={disabled}
        testIdPrefix="tag"
        icon={<LocalOfferIcon />}
      />
      <TagInput
        label="Flags"
        values={flags}
        availableValues={availableFlags}
        onChange={onFlagsChange}
        disabled={disabled}
        testIdPrefix="flag"
        icon={<FlagIcon />}
      />
    </Box>
  );
};

