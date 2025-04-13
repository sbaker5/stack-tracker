import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { signIn } from '../../firebase/auth';

interface SignInProps {
  onSignUp: () => void;
  onSuccess?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignUp, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        // Use the specific error message from the auth function
        setError(error.toString());
        setLoading(false);
        return;
      }
      
      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('SignIn component error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Sign In to Stack Tracker
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
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              component="button" 
              variant="body2" 
              onClick={onSignUp}
              underline="hover"
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
