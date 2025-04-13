import React from 'react';
import { Chip, TextField, Autocomplete, Box, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

/**
 * Props for the TagInput component
 *
 * @interface TagInputProps
 * @property {string} label - Label for the input field
 * @property {string[] | null} [values] - Currently selected values
 * @property {string[] | null} [availableValues] - List of available values for autocomplete
 * @property {(newValues: string[]) => void} onChange - Callback when values change
 * @property {boolean} [disabled] - Disables all interactions
 * @property {string} testIdPrefix - Prefix for test IDs
 * @property {React.ReactElement} icon - Icon to show in chips
 */
interface TagInputProps {
  label: string;
  values?: string[] | null;
  availableValues?: string[] | null;
  onChange: (newValues: string[]) => void;
  disabled?: boolean;
  testIdPrefix: string;
  icon: React.ReactElement;
}

/**
 * A reusable input component for managing tags or flags
 * 
 * Behavior:
 * - When disabled=true, only shows existing values without input field
 * - When availableValues is empty/undefined, shows disabled input field
 * - Always shows existing values in both cases
 */
/**
 * A reusable input component for managing tags or flags
 * 
 * Behavior:
 * - When disabled=true, only shows existing values without input field
 * - When availableValues is empty/undefined, shows disabled input field
 * - Always shows existing values in both cases
 * - Handles null/undefined values gracefully
 */
/**
 * A reusable input component for managing tags or flags with autocomplete support.
 * 
 * Features:
 * - Autocomplete suggestions from available values
 * - Handles disabled states gracefully
 * - Prevents duplicate entries
 * - Input validation and whitespace trimming
 * - Handles null/undefined values
 * 
 * @component
 * @example
 * ```tsx
 * <TagInput
 *   label="Tags"
 *   values={['react']}
 *   availableValues={['react', 'typescript']}
 *   onChange={setValues}
 *   testIdPrefix="tag"
 *   icon={<TagIcon />}
 * />
 * ```
 */
export const TagInput: React.FC<TagInputProps> = ({
  label,
  values = [],
  availableValues = [],
  onChange,
  disabled = false,
  testIdPrefix,
  icon
}) => {
  // Normalize input arrays
  const normalizedValues = React.useMemo(() => {
    return Array.isArray(values) ? values : [];
  }, [values]);

  // Filter and normalize available values
  const normalizedOptions = React.useMemo(() => {
    if (!Array.isArray(availableValues)) return [];
    const uniqueValues = new Set(availableValues
      .map(v => v?.trim())
      .filter(Boolean)
    );
    return Array.from(uniqueValues)
      .filter(v => !normalizedValues.includes(v));
  }, [availableValues, normalizedValues]);

  // Handle value deletion
  const handleDelete = (valueToDelete: string) => {
    onChange(normalizedValues.filter(v => v !== valueToDelete));
  };

  // Handle input state
  const [inputValue, setInputValue] = React.useState('');

  // Handle value addition
  const handleAdd = (_event: React.SyntheticEvent, value: string | null) => {
    if (!value?.trim()) return;
    const trimmedValue = value.trim();
    if (!normalizedValues.includes(trimmedValue)) {
      onChange([...normalizedValues, trimmedValue]);
      setInputValue('');
    }
  };

  // Handle input change
  const handleInputChange = (_event: React.SyntheticEvent, value: string) => {
    setInputValue(value);
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        className="mb-2"
        id={`${testIdPrefix}-label`}
      >
        {label}
      </Typography>
      <Box 
        className="flex flex-wrap gap-2 mb-2"
        role="list"
        aria-label={`Selected ${label.toLowerCase()}`}
      >
        {normalizedValues.map((value) => (
          <Box
            key={value}
            role="listitem"
          >
            <Chip
              label={value}
              onDelete={disabled ? undefined : () => handleDelete(value)}
              icon={icon}
              color="primary"
              variant="outlined"
              data-testid={`${testIdPrefix}-${value}`}
              deleteIcon={<span aria-label={`Remove ${value}`}>×</span>}
              aria-label={`${value} ${label.toLowerCase()}`}
            />
          </Box>
        ))}
      </Box>
      <Typography
        id={`${testIdPrefix}-description`}
        className="sr-only"
      >
        {normalizedOptions.length
          ? `Type to search or add new ${label.toLowerCase()}`
          : `No available ${label.toLowerCase()} to add`
        }
      </Typography>
      {!disabled && (
        <Autocomplete
          freeSolo
          options={normalizedOptions}
          value={null}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleAdd}
          disabled={!normalizedOptions.length}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {React.cloneElement(icon, { fontSize: 'small' })}
              {option}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder={normalizedOptions.length ? `Add ${label.toLowerCase()}` : `No available ${label.toLowerCase()}`}
              data-testid={`${testIdPrefix}-input`}
              disabled={!normalizedOptions.length}
              aria-labelledby={`${testIdPrefix}-label`}
              aria-describedby={`${testIdPrefix}-description`}
            />
          )}
          PaperComponent={props => (
            <Box
              component="div"
              {...props}
              data-testid={`${testIdPrefix}-autocomplete-popper`}
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 3,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                zIndex: 1300,
                overflow: 'hidden'
              }}
            />
          )}
        />
      )}
    </Box>
  );
};
