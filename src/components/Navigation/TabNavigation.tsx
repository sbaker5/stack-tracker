import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  useTheme, 
  Paper, 
  Typography,
  Divider
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BusinessIcon from '@mui/icons-material/Business';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SettingsIcon from '@mui/icons-material/Settings';

// Import components
import { TagFlagManager } from '../TagFlagManager/TagFlagManager';
import { ClientsList } from '../Clients/ClientsList';
import { ClientStack } from '../Technologies/ClientStack';
import { TechnologyTypeManager } from '../Settings/TechnologyTypeManager';
import { ExampleDataLoader } from '../Settings/ExampleDataLoader';

// Settings Panel Component
const SettingsPanel = () => (
  <Box p={3}>
    <Typography variant="h5" gutterBottom>
      Settings
    </Typography>
    <Typography paragraph>
      Customize your Stack Tracker application settings.
    </Typography>
    
    {/* Technology Types Section */}
    <Box mb={4}>
      <TechnologyTypeManager />
    </Box>
    
    <Divider sx={{ my: 4 }} />
    
    {/* Example Data Loader */}
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        Sample Data
      </Typography>
      <ExampleDataLoader />
    </Box>
    
    <Divider sx={{ my: 4 }} />
    
    {/* Other Settings Sections */}
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        User Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Customize your Stack Tracker experience
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Data Management
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Options for importing and exporting your data
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Appearance
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Customize the look and feel of Stack Tracker
      </Typography>
    </Box>
  </Box>
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stack-tracker-tabpanel-${index}`}
      aria-labelledby={`stack-tracker-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

import { useAuth } from '../../context/AuthContext';

export const TabNavigation: React.FC = () => {
  const [value, setValue] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    // Automatically switch to the client stack tab when a client is selected
    setValue(0);
  };

  // Initialize tags and flags for the TagFlagManager in the Tags tab
  const [tags, setTags] = useState<string[]>(['enterprise', 'finance']);
  const [flags, setFlags] = useState<string[]>(['Renewal Due']);
  const availableTags = ['enterprise', 'finance', 'healthcare', 'tech', 'startup', 'manufacturing', 'education', 'government'];
  const availableFlags = ['Renewal Due', 'Follow-Up Needed', 'Expansion Planned', 'At Risk', 'VIP'];

  const { currentUser, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    const res = await signOut();
    if (res.success) {
      window.location.reload(); // Or redirect to login page if you have routing
    } else {
      setLogoutError(res.error || 'Failed to log out');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* User info and logout button */}
      {currentUser && (
        <Box display="flex" alignItems="center" justifyContent="flex-end" px={2} pt={1}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {currentUser.displayName || currentUser.email}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}
            onClick={handleLogout}
            aria-label="Logout"
            tabIndex={0}
            role="button"
          >
            Logout
          </Typography>
        </Box>
      )}
      {logoutError && (
        <Typography color="error" variant="caption" sx={{ ml: 2 }}>{logoutError}</Typography>
      )}
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper 
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="stack tracker navigation tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<AccountTreeIcon />} 
            label="Client Stack" 
            id="stack-tracker-tab-0"
            aria-controls="stack-tracker-tabpanel-0" 
          />
          <Tab 
            icon={<BusinessIcon />} 
            label="Clients" 
            id="stack-tracker-tab-1"
            aria-controls="stack-tracker-tabpanel-1" 
          />
          <Tab 
            icon={<LocalOfferIcon />} 
            label="Tags" 
            id="stack-tracker-tab-2"
            aria-controls="stack-tracker-tabpanel-2" 
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="Settings" 
            id="stack-tracker-tab-3"
            aria-controls="stack-tracker-tabpanel-3" 
          />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <ClientStack clientId={selectedClientId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ClientsList 
          selectedClientId={selectedClientId} 
          onClientSelect={handleClientSelect} 
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            Tags & Flags
          </Typography>
          <TagFlagManager
            tags={tags}
            flags={flags}
            availableTags={availableTags}
            availableFlags={availableFlags}
            onTagsChange={setTags}
            onFlagsChange={setFlags}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SettingsPanel />
      </TabPanel>
    </Box>
  );
};

export default TabNavigation;
