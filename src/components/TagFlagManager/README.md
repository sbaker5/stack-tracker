# TagFlagManager Component

See [full documentation](/docs/components/TagFlagManager.md) for detailed usage, examples, and API reference.

## Quick Start

```tsx
import { TagFlagManager } from './TagFlagManager';

function MyComponent() {
  const [tags, setTags] = React.useState(['react']);
  const [flags, setFlags] = React.useState(['urgent']);

  return (
    <TagFlagManager
      tags={tags}
      flags={flags}
      availableTags={['react', 'typescript']}
      availableFlags={['urgent', 'in-progress']}
      onTagsChange={setTags}
      onFlagsChange={setFlags}
    />
  );
}
```

## Development

- Tests: `npm test`
- Coverage: `npm test -- --coverage`
- Documentation: See `/docs/components/TagFlagManager.md`

## Contributing

1. Follow established patterns in `TagInput` for reusable components
2. Maintain high test coverage
3. Document changes in both JSDoc and markdown
4. Test accessibility with screen readers
