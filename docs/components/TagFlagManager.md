# TagFlagManager Component

A flexible React component for managing tags and flags with autocomplete support.

## Features

- Manage both tags and flags with a unified interface
- Autocomplete suggestions from available values
- Handles disabled states gracefully
- Full keyboard navigation support
- Screen reader friendly
- Prevents duplicate entries
- Handles null/undefined/empty values
- Input validation and whitespace trimming

## Usage

```tsx
import { TagFlagManager } from '../components/TagFlagManager';

function MyComponent() {
  const [tags, setTags] = React.useState(['react', 'typescript']);
  const [flags, setFlags] = React.useState(['needs-review']);

  return (
    <TagFlagManager
      tags={tags}
      flags={flags}
      availableTags={['react', 'typescript', 'javascript', 'css']}
      availableFlags={['needs-review', 'urgent', 'in-progress']}
      onTagsChange={setTags}
      onFlagsChange={setFlags}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| tags | string[] | No | [] | Currently selected tags |
| flags | string[] | No | [] | Currently selected flags |
| availableTags | string[] | No | [] | List of available tags for autocomplete |
| availableFlags | string[] | No | [] | List of available flags for autocomplete |
| onTagsChange | (newTags: string[]) => void | Yes | - | Callback when tags change |
| onFlagsChange | (newFlags: string[]) => void | Yes | - | Callback when flags change |
| disabled | boolean | No | false | Disables all interactions |

## Behavior

1. Disabled State:
   - When `disabled={true}`, only shows existing values without input fields
   - When `availableValues` is empty/undefined, shows disabled input field
   - Always shows existing values in both cases

2. Input Handling:
   - Trims whitespace from input values
   - Prevents duplicate entries
   - Validates input before adding
   - Clears input after successful addition

3. Accessibility:
   - Full keyboard navigation
   - ARIA labels and roles
   - Screen reader announcements
   - High contrast visual indicators

## Examples

### Basic Usage
```tsx
<TagFlagManager
  tags={['react']}
  flags={['urgent']}
  onTagsChange={setTags}
  onFlagsChange={setFlags}
/>
```

### With Autocomplete Options
```tsx
<TagFlagManager
  tags={['react']}
  flags={['urgent']}
  availableTags={['react', 'typescript', 'javascript']}
  availableFlags={['urgent', 'needs-review', 'in-progress']}
  onTagsChange={setTags}
  onFlagsChange={setFlags}
/>
```

### Disabled State
```tsx
<TagFlagManager
  tags={['react']}
  flags={['urgent']}
  onTagsChange={setTags}
  onFlagsChange={setFlags}
  disabled={true}
/>
```

## Testing

The component has comprehensive test coverage including:
- Unit tests for all functionality
- Integration tests for component interaction
- Edge case handling
- Accessibility testing

Run tests with:
```bash
npm test
```

## Performance Considerations

1. Memoization:
   - Available options are memoized
   - Normalized values are memoized
   - Render optimizations for large lists

2. Bundle Size:
   - Tree-shakeable
   - Only imports required Material-UI components

## Accessibility

The component follows WCAG 2.1 guidelines:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast visual indicators
- Focus management
