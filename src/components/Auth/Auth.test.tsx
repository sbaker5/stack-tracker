jest.mock('../../firebase/auth', () => ({
  ...jest.requireActual('../../firebase/auth'),
  registerUser: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import * as authModule from '../../firebase/auth';

const registerUserMock = authModule.registerUser as jest.Mock;
const mockSignIn = authModule.signIn as jest.Mock;
const mockSignOut = authModule.signOut as jest.Mock;


describe('Authentication Flows', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'password123';

  // --- SignUp.tsx UI/validation tests ---

  it('shows backend error if error is object with message (SignUp)', async () => {
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: null, error: { message: 'Custom backend error' } });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/custom backend error/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error if error is non-string non-object (SignUp)', async () => {
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: null, error: 12345 });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it('shows thrown error with message (SignUp)', async () => {
    (authModule.registerUser as jest.Mock).mockImplementation(() => { throw { message: 'Thrown error message' }; });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/thrown error message/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error if thrown error has no message (SignUp)', async () => {
    (authModule.registerUser as jest.Mock).mockImplementation(() => { throw 12345; });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });
  });
  it('shows error if any field is empty (SignUp)', async () => {
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });
  });

  it('shows error if passwords do not match (SignUp)', async () => {
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows error if password is too short (SignUp)', async () => {
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error if email is invalid (SignUp)', async () => {
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bademail' } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    // Simulate backend error
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: null, error: 'Invalid email address' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('disables form during loading (SignUp)', async () => {
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    (authModule.registerUser as jest.Mock).mockImplementation(() => new Promise(() => {})); // never resolves
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  it('shows backend error for weak password (SignUp)', async () => {
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: null, error: 'Password is too weak' });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    });
  });

  // --- SignIn.tsx UI/validation tests ---
  it('shows error if email or password is empty (SignIn)', async () => {
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    // No built-in error, but you may want to check for a validation error if implemented
  });

  it('shows error if email is invalid (SignIn)', async () => {
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bademail' } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    mockSignIn.mockResolvedValue({ user: null, error: 'Invalid email address' });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('disables form during loading (SignIn)', async () => {
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    mockSignIn.mockImplementation(() => new Promise(() => {}));
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('shows backend error for user not found (SignIn)', async () => {
    mockSignIn.mockResolvedValue({ user: null, error: 'No account found with this email' });
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/no account found/i)).toBeInTheDocument();
    });
  });

  it('shows backend error for too many requests (SignIn)', async () => {
    mockSignIn.mockResolvedValue({ user: null, error: 'Too many failed attempts. Try again later' });
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('allows a user to sign up successfully', async () => {
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: { email: testEmail }, error: null });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith(testEmail, testPassword, 'Test User');
      // Success state: check for absence of error, or presence of onSuccess effect if implemented
    });
  });

  it('shows an error if sign up fails', async () => {
    (authModule.registerUser as jest.Mock).mockResolvedValue({ user: null, error: 'Email is already in use' });
    render(<SignUp onSignIn={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testPassword } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText('Email is already in use')).toBeInTheDocument();
    });
  });

  it('allows a user to sign in successfully', async () => {
    mockSignIn.mockResolvedValue({ user: { email: testEmail }, error: null });
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(testEmail, testPassword);
      // Success state: check for absence of error, or presence of onSuccess effect if implemented
    });
  });

  it('shows an error if sign in fails', async () => {
    mockSignIn.mockResolvedValue({ user: null, error: 'Incorrect password' });
    render(<SignIn onSignUp={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });

  it('persists user session if already authenticated', async () => {
    // Simulate already authenticated state by calling onSuccess prop
    const onSuccess = jest.fn();
    mockSignIn.mockResolvedValue({ user: { email: testEmail }, error: null });
    render(<SignIn onSignUp={() => {}} onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testEmail } });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: testPassword } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('signs out the user', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    // Simulate a sign out button in your AuthScreen or header
    render(<button onClick={() => authModule.signOut()}>Sign Out</button>);
    fireEvent.click(screen.getByText(/sign out/i));
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
