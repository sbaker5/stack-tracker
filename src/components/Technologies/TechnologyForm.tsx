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
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import { Technology } from '../../types/models';
import { addTechnology, updateTechnology } from '../../firebase/clients';
import { useTechnologyTypes } from '../../hooks/useTechnologyTypes';

interface TechnologyFormProps {
  technology?: Technology;
  clientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Get icon for technology type
const getIconForType = (iconName?: string) => {
  switch (iconName) {
    case 'code': return <CodeIcon />;
    case 'storage': return <StorageIcon />;
    case 'cloud': return <CloudIcon />;
    case 'security': return <SecurityIcon />;
    default: return <LanguageIcon />;
  }
};

export const TechnologyForm: React.FC<TechnologyFormProps> = ({
  technology,
  clientId,
  onSuccess,
  onCancel
}) => {
  // Get technology types from Firebase
  const { techTypes, loading: techTypesLoading } = useTechnologyTypes();
  
  // Form state
  const [name, setName] = useState(technology?.name || '');
  const [type, setType] = useState(technology?.type || '');
  const [description, setDescription] = useState(technology?.description || '');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [typeError, setTypeError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Technology name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!type) {
      setTypeError('Technology type is required');
      isValid = false;
    } else {
      setTypeError('');
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
      const techData = {
        name,
        type,
        description,
        clientId
      };
      
      if (technology) {
        // Update existing technology
        const { success, error } = await updateTechnology(technology.id, techData);
        
        if (!success) {
          throw new Error(error as string || 'Failed to update technology');
        }
      } else {
        // Add new technology
        const { id, error } = await addTechnology(clientId, techData as Omit<Technology, 'id'>);
        
        if (!id) {
          throw new Error(error as string || 'Failed to add technology');
        }
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving technology:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {technology ? 'Edit Technology' : 'Add New Technology'}
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
          label="Technology Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth required error={!!typeError} sx={{ mb: 2 }}>
          <InputLabel id="type-label">Technology Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={type}
            label="Technology Type"
            onChange={(e) => setType(e.target.value)}
            disabled={loading || techTypesLoading}
          >
            {techTypes.length === 0 ? (
              <MenuItem value="" disabled>
                <em>Loading technology types...</em>
              </MenuItem>
            ) : (
              techTypes.map((techType) => (
                <MenuItem key={techType.value} value={techType.value}>
                  <ListItemIcon>
                    {getIconForType(techType.icon)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={techType.name} 
                    secondary={techType.description} 
                  />
                </MenuItem>
              ))
            )}
          </Select>
          {typeError && (
            <Typography color="error" variant="caption">
              {typeError}
            </Typography>
          )}
        </FormControl>
        
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
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
            {technology ? 'Update Technology' : 'Add Technology'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
