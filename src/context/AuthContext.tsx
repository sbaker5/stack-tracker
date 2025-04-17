import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges, signOut as firebaseSignOut } from '../firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  signIn: async () => ({ user: null, error: 'Not implemented' }),
  signUp: async () => ({ user: null, error: 'Not implemented' }),
  signOut: async () => ({ success: false, error: 'Not implemented' }),
  resetPassword: async () => ({ success: false, error: 'Not implemented' })
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Auth functions
  const signIn = async (email: string, password: string) => {
    try {
      // Implementation would go here in a real app
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: 'Authentication error' };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      // Implementation would go here in a real app
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: 'Authentication error' };
    }
  };

  const signOut = async () => {
    try {
      const result = await firebaseSignOut();
      if (result && result.error) {
        return { success: false, error: result.error };
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Sign out error' };
    }
  };


  const resetPassword = async (email: string) => {
    try {
      // Implementation would go here in a real app
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Password reset error' };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
