import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import { TechnologyType } from '../../types/models';
import { deleteTechnologyType } from '../../firebase/technologyTypes';
import { useTechnologyTypes } from '../../hooks/useTechnologyTypes';
import { TechnologyTypeForm } from './TechnologyTypeForm';

export const TechnologyTypeManager: React.FC = () => {
  // Fetch technology types from Firebase
  const { techTypes, loading, error } = useTechnologyTypes();
  
  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingType, setEditingType] = useState<TechnologyType | null>(null);
  const [deletingType, setDeletingType] = useState<TechnologyType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Get icon component based on icon name
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'code': return <CodeIcon />;
      case 'storage': return <StorageIcon />;
      case 'cloud': return <CloudIcon />;
      case 'security': return <SecurityIcon />;
      default: return <LanguageIcon />;
    }
  };

  // Handle technology type deletion
  const handleDeleteType = async () => {
    if (!deletingType) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const { success, error } = await deleteTechnologyType(deletingType.id);
      
      if (!success) {
        throw new Error(error as string || 'Failed to delete technology type');
      }
      
      setDeletingType(null);
    } catch (err) {
      console.error('Error deleting technology type:', err);
      setDeleteError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingType(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Technology Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          size="small"
        >
          Add Type
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          {typeof error === 'string' && error.includes('Firebase') && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please check your Firestore security rules in the Firebase Console. You need to allow access to the 'technologyTypes' collection.
            </Typography>
          )}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : techTypes.length === 0 ? (
        <Box textAlign="center" p={2}>
          <Typography color="text.secondary">
            No technology types found. Click "Add Type" to create your first technology type.
          </Typography>
        </Box>
      ) : (
        <Card variant="outlined">
          <List>
            {techTypes.map((type, index) => (
              <React.Fragment key={type.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem>
                  <ListItemIcon>
                    {getIconComponent(type.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={type.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {type.value}
                        </Typography>
                        {type.description && (
                          <Typography component="span" variant="body2" display="block">
                            {type.description}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => setEditingType(type)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setDeletingType(type)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
      
      {/* Add Technology Type Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <TechnologyTypeForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Dialog>
      
      {/* Edit Technology Type Dialog */}
      <Dialog
        open={!!editingType}
        onClose={() => setEditingType(null)}
        maxWidth="md"
        fullWidth
      >
        {editingType && (
          <TechnologyTypeForm
            techType={editingType}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingType(null)}
          />
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingType}
        onClose={() => setDeletingType(null)}
      >
        <Box p={3} width={400}>
          <Typography variant="h6" gutterBottom>
            Delete Technology Type
          </Typography>
          
          <Typography variant="body1" paragraph>
            Are you sure you want to delete {deletingType?.name}? This may affect technologies that use this type.
          </Typography>
          
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => setDeletingType(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteType}
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
