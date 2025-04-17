import '@testing-library/jest-dom';

// Suppress MUI act() warnings in tests
if (!process.env.BACKEND_TEST) {
  const originalError = console.error;
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    // Suppress common test warnings that don't affect functionality
    if (typeof args[0] === 'string' && (
      args[0].includes('Warning: An update to') ||
      args[0].includes('Warning: React.jsx: type is invalid')
    )) {
      return;
    }
    originalError(...args);
  });
}


// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
    }
  }
}
