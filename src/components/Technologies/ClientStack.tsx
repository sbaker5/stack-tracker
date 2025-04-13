import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import { Client, Technology } from '../../types/models';
import { TechnologyForm } from './TechnologyForm';
import { deleteTechnology } from '../../firebase/clients';
import { useClient } from '../../hooks/useClients';
import { useTechnologyTypes } from '../../hooks/useTechnologyTypes';

interface ClientStackProps {
  clientId: string | null;
}

export const ClientStack: React.FC<ClientStackProps> = ({ clientId }) => {
  // Fetch client and technologies from Firebase
  const { client, technologies, loading, error } = useClient(clientId);
  
  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [deletingTech, setDeletingTech] = useState<Technology | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Get technology types from Firebase
  const { techTypes } = useTechnologyTypes();
  
  // Get icon for technology type
  const getIconForType = (typeValue: string) => {
    const techType = techTypes.find(t => t.value === typeValue);
    
    if (!techType || !techType.icon) {
      return <LanguageIcon />;
    }
    
    switch (techType.icon) {
      case 'code': return <CodeIcon />;
      case 'storage': return <StorageIcon />;
      case 'cloud': return <CloudIcon />;
      case 'security': return <SecurityIcon />;
      default: return <LanguageIcon />;
    }
  };
  
  // Get technology type name
  const getTypeName = (typeValue: string) => {
    const techType = techTypes.find(t => t.value === typeValue);
    return techType ? techType.name : typeValue.charAt(0).toUpperCase() + typeValue.slice(1);
  };

  // Handle technology deletion
  const handleDeleteTechnology = async () => {
    if (!deletingTech) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const { success, error } = await deleteTechnology(deletingTech.id);
      
      if (!success) {
        throw new Error(error as string || 'Failed to delete technology');
      }
      
      setDeletingTech(null);
    } catch (err) {
      console.error('Error deleting technology:', err);
      setDeleteError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingTech(null);
  };

  // If no client is selected
  if (!clientId) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" height="300px">
        <Typography variant="h6" color="text.secondary">
          Please select a client from the Clients tab
        </Typography>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error || !client) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error || 'Client not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {client.name} - Technology Stack
      </Typography>
      
      <Typography variant="body1" paragraph>
        {client.description}
      </Typography>
      
      <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
        {client.tags.map(tag => (
          <Chip key={tag} label={tag} color="primary" variant="outlined" size="small" />
        ))}
        {client.flags.map(flag => (
          <Chip key={flag} label={flag} color="secondary" size="small" />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Technologies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Add Technology
        </Button>
      </Box>
      
      {technologies.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography color="text.secondary">
            No technologies found. Click "Add Technology" to add your first technology.
          </Typography>
        </Box>
      ) : (
        <List>
          {technologies.map((tech) => (
            <Card key={tech.id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem disablePadding>
                  <ListItemIcon>
                    {getIconForType(tech.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={tech.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {getTypeName(tech.type)}
                        </Typography>
                        {" — "}{tech.description}
                      </>
                    }
                  />
                  <Box>
                    <IconButton
                      aria-label="edit"
                      onClick={() => setEditingTech(tech)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => setDeletingTech(tech)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
      
      {/* Add Technology Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <TechnologyForm
          clientId={clientId}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Dialog>
      
      {/* Edit Technology Dialog */}
      <Dialog
        open={!!editingTech}
        onClose={() => setEditingTech(null)}
        maxWidth="md"
        fullWidth
      >
        {editingTech && (
          <TechnologyForm
            technology={editingTech}
            clientId={clientId}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingTech(null)}
          />
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingTech}
        onClose={() => setDeletingTech(null)}
      >
        <Box p={3} width={400}>
          <Typography variant="h6" gutterBottom>
            Delete Technology
          </Typography>
          
          <Typography variant="body1" paragraph>
            Are you sure you want to delete {deletingTech?.name}? This action cannot be undone.
          </Typography>
          
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => setDeletingTech(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteTechnology}
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
