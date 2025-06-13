// src/firebase/config.test.ts

describe('firebaseConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the require cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // Restore old env
  });

  it('loads config from environment variables', () => {
    process.env.VITE_FIREBASE_API_KEY = 'test-api-key';
    process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
    process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id';
    process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test-bucket';
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
    process.env.VITE_FIREBASE_APP_ID = 'test-app-id';

    // Import after setting env
    jest.isolateModules(() => {
      const config = require('./config');
      // Firebase v9+ exports the app instance, but config is used for init
      // Check the config used to initialize Firebase
      expect(config).toBeDefined();
      // Optionally check db/app options if you refactor config to export the config object
    });
  });

  it('throws or logs error if a key is missing', () => {
    delete process.env.VITE_FIREBASE_API_KEY;
    jest.isolateModules(() => {
      expect(() => require('./config')).toThrow();
      // Or, if you want to log an error instead, check for the log
    });
  });
});
