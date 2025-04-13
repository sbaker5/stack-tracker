import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabNavigation } from './TabNavigation';

// Mock the components that will be rendered in tabs
jest.mock('../TagFlagManager/TagFlagManager', () => ({
  TagFlagManager: () => <div data-testid="tag-flag-manager">TagFlagManager Component</div>
}));

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
    const globexRadio = screen.getByLabelText(/Globex Industries/i, { selector: 'input' });
    await user.click(globexRadio);
    
    // Check that we're automatically redirected to the client stack tab
    expect(screen.getByText('Globex Industries - Technology Stack')).toBeInTheDocument();
    
    // Verify the tab label is updated with the client name
    expect(screen.getByRole('tab', { name: /Globex Industries's Stack/i })).toBeInTheDocument();
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
    
    // Check that tabpanels have proper ARIA attributes
    const tabpanels = screen.getAllByRole('tabpanel');
    expect(tabpanels.length).toBe(4);
    
    tabpanels.forEach((panel, index) => {
      expect(panel).toHaveAttribute('id', `stack-tracker-tabpanel-${index}`);
      expect(panel).toHaveAttribute('aria-labelledby', `stack-tracker-tab-${index}`);
    });
  });
});
