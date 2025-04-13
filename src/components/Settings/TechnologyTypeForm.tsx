import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { TechnologyType } from '../../types/models';
import { addTechnologyType, updateTechnologyType } from '../../firebase/technologyTypes';

// Icons for technology types
const ICON_OPTIONS = [
  { value: 'code', label: 'Code (Frontend)' },
  { value: 'storage', label: 'Storage (Backend/Database)' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'security', label: 'Security' },
  { value: 'language', label: 'Language (Other)' }
];

interface TechnologyTypeFormProps {
  techType?: TechnologyType;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TechnologyTypeForm: React.FC<TechnologyTypeFormProps> = ({
  techType,
  onSuccess,
  onCancel
}) => {
  // Form state
  const [name, setName] = useState(techType?.name || '');
  const [value, setValue] = useState(techType?.value || '');
  const [description, setDescription] = useState(techType?.description || '');
  const [icon, setIcon] = useState(techType?.icon || 'code');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [valueError, setValueError] = useState('');

  // Generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    // Only auto-generate value if it's a new tech type or value is empty
    if (!techType || !value) {
      setValue(newName.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!value.trim()) {
      setValueError('Value is required');
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      setValueError('Value must contain only lowercase letters, numbers, and hyphens');
      isValid = false;
    } else {
      setValueError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const techTypeData = {
        name,
        value,
        description,
        icon
      };
      
      if (techType) {
        // Update existing technology type
        const { success, error } = await updateTechnologyType(techType.id, techTypeData);
        
        if (!success) {
          throw new Error(error as string || 'Failed to update technology type');
        }
      } else {
        // Add new technology type
        const { id, error } = await addTechnologyType(techTypeData as Omit<TechnologyType, 'id'>);
        
        if (!id) {
          throw new Error(error as string || 'Failed to add technology type');
        }
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving technology type:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {techType ? 'Edit Technology Type' : 'Add New Technology Type'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Display Name"
          name="name"
          value={name}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError || "The name shown in the UI (e.g., 'Frontend')"}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="value"
          label="Value"
          name="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!valueError}
          helperText={valueError || "The unique identifier used in the database (e.g., 'frontend')"}
          disabled={loading || !!techType} // Disable editing value for existing types
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText="A brief description of this technology type"
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="icon-label">Icon</InputLabel>
          <Select
            labelId="icon-label"
            id="icon"
            value={icon}
            label="Icon"
            onChange={(e) => setIcon(e.target.value)}
            disabled={loading}
          >
            {ICON_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {techType ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
