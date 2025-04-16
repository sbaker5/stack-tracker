// Restore original console.error to avoid recursion from frontend setup
beforeAll(() => {
  // @ts-ignore
  if (console._originalError) {
    console.error = console._originalError;
  }
});

// Mock Firebase SDK methods and config at the very top
jest.mock('./config', () => ({
  auth: {},
}));

const createUserWithEmailAndPassword = jest.fn();
const updateProfile = jest.fn();
const signInWithEmailAndPassword = jest.fn();
const firebaseSignOut = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: any[]) => createUserWithEmailAndPassword(...args),
  updateProfile: (...args: any[]) => updateProfile(...args),
  signInWithEmailAndPassword: (...args: any[]) => signInWithEmailAndPassword(...args),
  signOut: (...args: any[]) => firebaseSignOut(...args),
}));

import { registerUser, signIn, signOut } from './auth';

describe('auth.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('registers a user successfully', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
      updateProfile.mockResolvedValue(undefined);
      const res = await registerUser('test@example.com', 'password123', 'Test User');
      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(updateProfile).toHaveBeenCalled();
      expect(res.user).toBeDefined();
      expect(res.error).toBeNull();
    });
    it('handles email already in use error', async () => {
      createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });
      const res = await registerUser('test@example.com', 'password123', 'Test User');
      expect(res.user).toBeNull();
      expect(res.error).toMatch(/already in use/i);
    });
    it('handles invalid email error', async () => {
      createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });
      const res = await registerUser('bademail', 'password123', 'Test User');
      expect(res.error).toMatch(/invalid email/i);
    });
    it('handles weak password error', async () => {
      createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/weak-password' });
      const res = await registerUser('test@example.com', '123', 'Test User');
      expect(res.error).toMatch(/too weak/i);
    });
    it('handles unknown error', async () => {
      createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/unknown', message: 'fail' });
      const res = await registerUser('test@example.com', 'password123', 'Test User');
      expect(res.error).toMatch(/failed to create account/i);
    });
  });

  describe('signIn', () => {
    it('signs in successfully', async () => {
      signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
      const res = await signIn('test@example.com', 'password123');
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(res.user).toBeDefined();
      expect(res.error).toBeNull();
    });
    it('handles user not found', async () => {
      signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });
      const res = await signIn('test@example.com', 'password123');
      expect(res.error).toMatch(/no account found/i);
    });
    it('handles wrong password', async () => {
      signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
      const res = await signIn('test@example.com', 'badpass');
      expect(res.error).toMatch(/incorrect password/i);
    });
    it('handles too many requests', async () => {
      signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/too-many-requests' });
      const res = await signIn('test@example.com', 'password123');
      expect(res.error).toMatch(/too many failed attempts/i);
    });
    it('handles unknown error', async () => {
      signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/unknown', message: 'fail' });
      const res = await signIn('test@example.com', 'password123');
      expect(res.error).toMatch(/failed to sign in/i);
    });
  });

  describe('signOut', () => {
    it('signs out successfully', async () => {
      firebaseSignOut.mockResolvedValue(undefined);
      const res = await signOut();
      expect(firebaseSignOut).toHaveBeenCalled();
      expect(res.error).toBeNull();
    });
    it('handles sign out error', async () => {
      firebaseSignOut.mockRejectedValue('fail');
      const res = await signOut();
      expect(res.error).toBe('fail');
    });
  });
});
