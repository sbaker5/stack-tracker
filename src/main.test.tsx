import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getRootElement, renderApp, initializeApp } from './main';

// Mock ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

describe('main', () => {
  beforeEach(() => {
    // Clear the document body
    document.body.innerHTML = '';
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getRootElement', () => {
    it('returns root element when it exists', () => {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);

      const result = getRootElement();
      expect(result).toBe(root);
    });

    it('throws error when root element is not found', () => {
      expect(() => {
        getRootElement();
      }).toThrow('Root element not found');
    });
  });

  describe('renderApp', () => {
    it('renders app into provided container', () => {
      const container = document.createElement('div');
      const result = renderApp(container);

      expect(createRoot).toHaveBeenCalledWith(container);
      expect(result.render).toHaveBeenCalledWith(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
  });

  describe('initializeApp', () => {
    it('initializes app successfully', () => {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);

      const result = initializeApp();

      expect(createRoot).toHaveBeenCalledWith(root);
      expect(result.render).toHaveBeenCalledWith(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });

    it('throws error when root element is missing', () => {
      expect(() => {
        initializeApp();
      }).toThrow('Root element not found');
    });
  });

  describe('environment check', () => {
    it('does not initialize in test environment', () => {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);

      process.env.NODE_ENV = 'test';

      jest.isolateModules(() => {
        require('./main');
      });

      expect(createRoot).not.toHaveBeenCalled();
    });
  });
});
