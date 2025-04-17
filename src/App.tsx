import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import TabNavigation from './components/Navigation/TabNavigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/Auth/AuthScreen';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
      },
    },
  },
});

// Main application content that requires authentication
const AuthenticatedApp = () => {
  const { currentUser } = useAuth();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Stack Tracker
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <TabNavigation />
      </Box>
    </Container>
  );
};

// Loading screen while checking authentication
const LoadingScreen = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CircularProgress />
  </Box>
);

// Main App component with authentication flow
export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// App content that handles authentication state
const AppContent = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return currentUser ? <AuthenticatedApp /> : <AuthScreen />;
}
