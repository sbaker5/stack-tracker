import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock firebase modules and config
jest.mock('firebase/app', () => ({ initializeApp: jest.fn() }));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({ getFirestore: jest.fn(() => ({})) }));
jest.mock('./firebase/config', () => ({
  auth: {},
  db: {},
  default: {},
}));
// Mock subscribeToAuthChanges to call the callback with null
jest.mock('./firebase/auth', () => ({
  subscribeToAuthChanges: (cb: any) => { cb(null); return () => {}; },
  signOut: jest.fn(() => Promise.resolve({ success: true, error: null })),
}));

import App from './App';

describe('App Smoke Test', () => {
  it('renders the Stack Tracker title or login', () => {
    render(<App />);
    // This will pass if either the main title or login is present
    expect(screen.queryAllByText(/Stack Tracker/i).length).toBeGreaterThan(0);
  });
});
