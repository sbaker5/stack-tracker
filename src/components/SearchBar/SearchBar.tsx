import React, { useState, useCallback } from 'react';
import { TextField, Autocomplete, Box, Typography, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

export interface SearchResult {
  id: string;
  name: string;
  type: 'client' | 'technology' | 'tag';
  category?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultSelect,
  placeholder = 'Search clients, technologies, or tags...',
  debounceMs = 300,
  minSearchLength = 2,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length >= minSearchLength) {
        setLoading(true);
        try {
          const results = await onSearch(query);
          setOptions(results);
        } catch (error) {
          console.error('Search error:', error);
          setOptions([]);
        }
        setLoading(false);
      } else {
        setOptions([]);
      }
    }, debounceMs),
    [onSearch, minSearchLength]
  );

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleOptionSelect = (event: React.SyntheticEvent, option: SearchResult | null) => {
    if (option) {
      onResultSelect(option);
      // Clear input after a small delay to ensure state is updated
      setTimeout(() => {
        setInputValue('');
        setOptions([]);
        setOpen(false);
      }, 0);
    }
  };

  const getOptionLabel = (option: SearchResult) => option.name;

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: SearchResult) => (
    <li {...props} data-testid={`search-result-${option.id}`}>
      <Box className="flex flex-col py-1">
        <Typography variant="body1">{option.name}</Typography>
        <Typography variant="caption" color="text.secondary" className="flex items-center gap-1">
          {option.category && (
            <>
              <span>{option.category}</span>
              <span>•</span>
            </>
          )}
          <span className="capitalize">{option.type}</span>
        </Typography>
      </Box>
    </li>
  );

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      options={options}
      getOptionLabel={getOptionLabel}
      loading={loading}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      PaperComponent={(props) => (
        <Paper {...props} data-testid="search-results-container" />
      )}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon className="text-gray-400 mr-2" data-testid="search-icon" />
                {params.InputProps.startAdornment}
              </>
            ),
            placeholder
          }}
          inputProps={{
            ...params.inputProps,
            'data-testid': 'search-input',
            placeholder
          }}
        />
      )}
    />
  );
};
