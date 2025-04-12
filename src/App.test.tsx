import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Stack Tracker Demo')).toBeInTheDocument();
  });

  it('renders TagFlagManager with initial state', () => {
    render(<App />);
    expect(screen.getByText('Tag & Flag Manager')).toBeInTheDocument();
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByTestId('flag-input')).toBeInTheDocument();
  });

  it('displays current state section', () => {
    render(<App />);
    expect(screen.getByText('Current State:')).toBeInTheDocument();
    const pre = screen.getByText((content) => 
      content.includes('"tags":') && content.includes('"flags":')); 
    expect(pre).toBeInTheDocument();
  });
});
