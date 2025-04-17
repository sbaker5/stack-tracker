import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabNavigation } from './TabNavigation';

// Mock the components that will be rendered in tabs
jest.mock('../TagFlagManager/TagFlagManager', () => ({
  TagFlagManager: () => <div data-testid="tag-flag-manager">TagFlagManager Component</div>
}));

jest.mock('../Technologies/ClientStack', () => ({
  ClientStack: ({ clientId }: any) => (
    <div data-testid="client-stack">
      {clientId ? `${clientId} Stack` : 'Please select a client from the Clients tab'}
    </div>
  )
}));

jest.mock('../Clients/ClientsList', () => ({
  ClientsList: ({ onClientSelect }: any) => (
    <div>
      <button aria-label="Select Acme Corporation" data-testid="client-acme" onClick={() => onClientSelect && onClientSelect('acme-id')}>Acme Corporation</button>
      <button aria-label="Select Globex Industries" data-testid="client-globex" onClick={() => onClientSelect && onClientSelect('globex-id')}>Globex Industries</button>
      <button aria-label="Select Initech Systems" data-testid="client-initech" onClick={() => onClientSelect && onClientSelect('initech-id')}>Initech Systems</button>
    </div>
  )
}));

import { AuthContext } from '../../context/AuthContext';

describe('TabNavigation', () => {
  it('renders all tabs correctly', () => {
    render(<TabNavigation />);
    
    // Check that all tab labels are rendered
    expect(screen.getByText('Client Stack')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays the Client Stack tab content by default with no client selected', () => {
    render(<TabNavigation />);
    
    // The first tab should be active by default with a prompt to select a client
    expect(screen.getByText('Please select a client from the Clients tab')).toBeInTheDocument();
  });

  it('switches to the Tags tab when clicked', async () => {
    const user = userEvent.setup();
    render(<TabNavigation />);
    
    // Click on the Tags tab
    await user.click(screen.getByText('Tags'));
    
    // Check that the TagFlagManager is now displayed
    expect(screen.getByTestId('tag-flag-manager')).toBeInTheDocument();
  });

  it('switches to the Clients tab when clicked', async () => {
    const user = userEvent.setup();
    render(<TabNavigation />);
    
    // Click on the Clients tab
    await user.click(screen.getByText('Clients'));
    
    // Check that the Clients list is displayed
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('Globex Industries')).toBeInTheDocument();
    expect(screen.getByText('Initech Systems')).toBeInTheDocument();
  });

  it('selects a client and updates the client stack tab', async () => {
    const user = userEvent.setup();
    render(<TabNavigation />);
    // Go to Clients tab
    await user.click(screen.getByText('Clients'));
    // Click on Globex Industries client button
    await user.click(screen.getByRole('button', { name: /Globex Industries/i }));
    // Go to Client Stack tab
    await user.click(screen.getByText('Client Stack'));
    // Check for client stack content (mock)
    expect(screen.getByTestId('client-stack')).toHaveTextContent('globex-id Stack');
  });

  it('switches to the Settings tab when clicked', async () => {
    const user = userEvent.setup();
    render(<TabNavigation />);
    
    // Click on the Settings tab
    await user.click(screen.getByText('Settings'));
    
    // Check that the Settings content is now displayed
    expect(screen.getByText('User Preferences')).toBeInTheDocument();
  });
  
  it('selects a client and updates the client stack tab', async () => {
    const user = userEvent.setup();
    render(<TabNavigation />);
    
    // Go to clients tab
    await user.click(screen.getByText('Clients'));
    
    // Select a client
    await user.click(screen.getByRole('button', { name: /Globex Industries/i }));
    // Check for client stack content (mock)
    expect(screen.getByTestId('client-stack')).toHaveTextContent('globex-id Stack');
  });

  it('logs out and redirects to /signin', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ success: true, error: null });
    const mockCurrentUser = {
      displayName: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
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
      uid: 'user-123',
      phoneNumber: null,
      photoURL: null,
      providerId: 'password'
    };
    const assignMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignMock },
      writable: true,
    });

    render(
      <AuthContext.Provider value={{
        currentUser: mockCurrentUser as any,
        loading: false,
        error: null,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: mockSignOut,
        resetPassword: jest.fn(),
      }}>
        <TabNavigation />
      </AuthContext.Provider>
    );

    // Click the Logout button
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);
    await screen.findByText('Logout');
    expect(mockSignOut).toHaveBeenCalled();
    expect(assignMock).toHaveBeenCalledWith('/signin');
  });

  it('maintains accessibility standards', () => {
    render(<TabNavigation />);
    
    // Check that tabs have proper ARIA attributes
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(4);
    
    tabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute('id', `stack-tracker-tab-${index}`);
      expect(tab).toHaveAttribute('aria-controls', `stack-tracker-tabpanel-${index}`);
    });
    
    // Check that at least one visible tabpanel is present
    const tabpanels = screen.getAllByRole('tabpanel');
    expect(tabpanels.length).toBeGreaterThanOrEqual(1);
    // Optionally, check ARIA attributes on the visible panel
    tabpanels.forEach((panel) => {
      expect(panel).toHaveAttribute('role', 'tabpanel');
      expect(panel).toHaveAttribute('id');
      expect(panel).toHaveAttribute('aria-labelledby');
    });
  });
});
