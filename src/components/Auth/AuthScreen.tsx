import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Stack Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your client technology stacks efficiently
        </Typography>
        
        {isSignIn ? (
          <SignIn 
            onSignUp={toggleAuthMode} 
            onSuccess={onAuthSuccess} 
          />
        ) : (
          <SignUp 
            onSignIn={toggleAuthMode} 
            onSuccess={onAuthSuccess} 
          />
        )}
      </Box>
    </Container>
  );
};

export default AuthScreen;
