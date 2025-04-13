import React, { useState, useEffect } from 'react';
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
  Chip,
  Stack
} from '@mui/material';
import { Client } from '../../types/models';
import { addClient, updateClient } from '../../firebase/clients';
import { TagFlagManager } from '../TagFlagManager/TagFlagManager';

interface ClientFormProps {
  client?: Client;
  onSuccess: () => void;
  onCancel: () => void;
}

// Industry options for dropdown
const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Education',
  'Government',
  'Non-profit',
  'Other'
];

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSuccess,
  onCancel
}) => {
  // Form state
  const [name, setName] = useState(client?.name || '');
  const [industry, setIndustry] = useState(client?.industry || '');
  const [description, setDescription] = useState(client?.description || '');
  const [tags, setTags] = useState<string[]>(client?.tags || []);
  const [flags, setFlags] = useState<string[]>(client?.flags || []);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Available tags and flags
  const availableTags = ['enterprise', 'finance', 'healthcare', 'tech', 'startup', 'manufacturing', 'education', 'government'];
  const availableFlags = ['Renewal Due', 'Follow-Up Needed', 'Expansion Planned', 'At Risk', 'VIP'];

  // Form validation
  const [nameError, setNameError] = useState('');
  const [industryError, setIndustryError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Client name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!industry) {
      setIndustryError('Industry is required');
      isValid = false;
    } else {
      setIndustryError('');
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
      const clientData = {
        name,
        industry,
        description,
        tags,
        flags
      };
      
      if (client) {
        // Update existing client
        const { success, error } = await updateClient(client.id, clientData);
        
        if (!success) {
          throw new Error(error as string || 'Failed to update client');
        }
      } else {
        // Add new client
        const { id, error } = await addClient(clientData as Omit<Client, 'id'>);
        
        if (!id) {
          throw new Error(error as string || 'Failed to add client');
        }
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving client:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {client ? 'Edit Client' : 'Add New Client'}
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
          label="Client Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth required error={!!industryError} sx={{ mb: 2 }}>
          <InputLabel id="industry-label">Industry</InputLabel>
          <Select
            labelId="industry-label"
            id="industry"
            value={industry}
            label="Industry"
            onChange={(e) => setIndustry(e.target.value)}
            disabled={loading}
          >
            {INDUSTRIES.map((ind) => (
              <MenuItem key={ind} value={ind}>
                {ind}
              </MenuItem>
            ))}
          </Select>
          {industryError && (
            <Typography color="error" variant="caption">
              {industryError}
            </Typography>
          )}
        </FormControl>
        
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Tags & Flags
        </Typography>
        
        <TagFlagManager
          tags={tags}
          flags={flags}
          availableTags={availableTags}
          availableFlags={availableFlags}
          onTagsChange={setTags}
          onFlagsChange={setFlags}
          disabled={loading}
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
            {client ? 'Update Client' : 'Add Client'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
