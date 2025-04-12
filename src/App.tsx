import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { TagFlagManager } from './components/TagFlagManager/TagFlagManager';

export function App() {
  const [tags, setTags] = React.useState<string[]>(['react', 'typescript']);
  const [flags, setFlags] = React.useState<string[]>(['in-progress']);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Stack Tracker Demo
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tag & Flag Manager
        </Typography>
        <TagFlagManager
          tags={tags}
          flags={flags}
          availableTags={['react', 'typescript', 'javascript', 'mui', 'tailwind']}
          availableFlags={['in-progress', 'needs-review', 'approved', 'blocked']}
          onTagsChange={setTags}
          onFlagsChange={setFlags}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current State:
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
          {JSON.stringify({ tags, flags }, null, 2)}
        </pre>
      </Box>
    </Container>
  );
}
