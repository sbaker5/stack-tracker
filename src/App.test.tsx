import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthContext } from './context/AuthContext';
import { User } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn()
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn()
}));

// Create a mock AuthContext provider for testing
const renderWithAuth = (ui: React.ReactElement, { user = null as User | null, loading = false } = {}) => {
  return render(
    <AuthContext.Provider
      value={{
        currentUser: user,
        loading,
        error: null,
        signIn: jest.fn().mockResolvedValue({ user: null, error: null }),
        signUp: jest.fn().mockResolvedValue({ user: null, error: null }),
        signOut: jest.fn().mockResolvedValue({ success: true, error: null }),
        resetPassword: jest.fn().mockResolvedValue({ success: true, error: null }),
      }}
    >
      {ui}
    </AuthContext.Provider>
  );
};

describe('App', () => {
  it('renders loading screen when auth is loading', () => {
    renderWithAuth(<App />, { loading: true });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders auth screen when user is not authenticated', () => {
    renderWithAuth(<App />, { user: null, loading: false });
    expect(screen.getByText(/sign in/i, { exact: false })).toBeInTheDocument();
  });

  it('renders main application when user is authenticated', () => {
    // Create a mock User object that matches Firebase User type
    const mockUser = { 
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: jest.fn(),
      getIdToken: jest.fn(),
      getIdTokenResult: jest.fn(),
      reload: jest.fn(),
      toJSON: jest.fn(),
      phoneNumber: null,
      photoURL: null,
      providerId: 'password'
    } as unknown as User;
    
    renderWithAuth(<App />, { user: mockUser, loading: false });
    
    // Check for the app title
    expect(screen.getByText('Stack Tracker')).toBeInTheDocument();
    
    // Check for user email
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
