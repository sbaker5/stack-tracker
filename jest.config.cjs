/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: [
        '<rootDir>/src/client-test/setupTests.ts',
        '<rootDir>/jest.setup.js'
      ],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/client-test/__mocks__/fileMock.js'
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/src/App.test.tsx',
        '/src/context/',
        '/src/firebase/',
        '/src/hooks/',
        '/src/scripts/'
      ],
      collectCoverageFrom: [
        'src/components/ExportMenu/**/*.{ts,tsx}',
        'src/components/Navigation/**/*.{ts,tsx}',
        'src/components/SearchBar/**/*.{ts,tsx}',
        'src/components/TagFlagManager/**/*.{ts,tsx}',
        'src/components/TreeView/**/*.{ts,tsx}',
        'src/components/Auth/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.mock.{ts,tsx}',
        '!src/**/__mocks__/**'
      ],
      coverageDirectory: '<rootDir>/coverage',
      coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
      verbose: true
    },
    {
      displayName: 'backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.empty-setup.js'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      testMatch: ['<rootDir>/src/firebase/**/*.test.ts'],
      testPathIgnorePatterns: ['/node_modules/'],
      collectCoverageFrom: [
        'src/firebase/auth.ts',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.mock.{ts,tsx}',
        '!src/**/__mocks__/**'
      ],
      coverageDirectory: '<rootDir>/coverage',
      coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
      verbose: true
    }
  ]
};
