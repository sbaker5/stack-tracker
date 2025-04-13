import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Client } from '../../types/models';
import { ClientForm } from './ClientForm';
import { deleteClient } from '../../firebase/clients';
import { useClients } from '../../hooks/useClients';

interface ClientsListProps {
  selectedClientId: string | null;
  onClientSelect: (clientId: string) => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  selectedClientId,
  onClientSelect
}) => {
  // Fetch clients from Firebase
  const { clients, loading, error } = useClients();
  
  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handle client deletion
  const handleDeleteClient = async () => {
    if (!deletingClient) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const { success, error } = await deleteClient(deletingClient.id);
      
      if (!success) {
        throw new Error(error as string || 'Failed to delete client');
      }
      
      // If the deleted client was selected, clear selection
      if (selectedClientId === deletingClient.id) {
        onClientSelect('');
      }
      
      setDeletingClient(null);
    } catch (err) {
      console.error('Error deleting client:', err);
      setDeleteError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingClient(null);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Clients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Add Client
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : clients.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography color="text.secondary">
            No clients found. Click "Add Client" to create your first client.
          </Typography>
        </Box>
      ) : (
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            aria-label="clients"
            name="clients-radio-group"
            value={selectedClientId || ''}
            onChange={(e) => onClientSelect(e.target.value)}
          >
            {clients.map((client) => (
              <Card key={client.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <FormControlLabel
                      value={client.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="h6">{client.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Industry: {client.industry}
                          </Typography>
                          <Typography variant="body2">
                            {client.description}
                          </Typography>
                          <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                            {client.tags.map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                            {client.flags.map(flag => (
                              <Chip
                                key={flag}
                                label={flag}
                                size="small"
                                color="secondary"
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', flex: 1 }}
                    />
                    <Box>
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingClient(client);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingClient(client);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
      )}
      
      {/* Add Client Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <ClientForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Dialog>
      
      {/* Edit Client Dialog */}
      <Dialog
        open={!!editingClient}
        onClose={() => setEditingClient(null)}
        maxWidth="md"
        fullWidth
      >
        {editingClient && (
          <ClientForm
            client={editingClient}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingClient(null)}
          />
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingClient}
        onClose={() => setDeletingClient(null)}
      >
        <Box p={3} width={400}>
          <Typography variant="h6" gutterBottom>
            Delete Client
          </Typography>
          
          <Typography variant="body1" paragraph>
            Are you sure you want to delete {deletingClient?.name}? This action cannot be undone.
          </Typography>
          
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => setDeletingClient(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClient}
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
