import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

// Separate the DOM manipulation for testing
export function getRootElement() {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element not found')
  }
  return root
}

// Separate the React rendering for testing
export function renderApp(container: HTMLElement) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  return root
}

// Main initialization function
export function initializeApp() {
  const rootElement = getRootElement()
  return renderApp(rootElement)
}

// Only run in browser environment
if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
  initializeApp()
}
