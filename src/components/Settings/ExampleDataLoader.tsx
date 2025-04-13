import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Collapse
} from '@mui/material';
import { populateExampleData } from '../../scripts/populateExampleData';

/**
 * Component for loading example data into the application
 * Follows the component behavior patterns from project guidelines
 */
export const ExampleDataLoader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleLoadExampleData = async () => {
    if (loading) return;
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const result = await populateExampleData();
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error as string || 'Failed to load example data');
      }
    } catch (err) {
      console.error('Error loading example data:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Example Data
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Populate your Stack Tracker with example clients and technology types based on enterprise tech stacks.
        </Typography>
        
        <Collapse in={expanded}>
          <Box mb={2}>
            <Typography variant="body2" paragraph>
              This will create:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  10 technology type categories (Cloud Infrastructure, Networking, Security, etc.)
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  5 example clients across different industries
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  30+ technologies assigned to these clients
                </Typography>
              </li>
            </ul>
            <Typography variant="body2" color="text.secondary" paragraph>
              Note: This will not overwrite your existing data, but will add to it.
            </Typography>
          </Box>
        </Collapse>
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Example data loaded successfully! Go to the Clients tab to see the new data.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoadExampleData}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Loading Data...' : 'Load Example Data'}
        </Button>
      </CardContent>
    </Card>
  );
};
