/**
 * FINN AI CEO - WEEK 3 FRONTEND
 * Dashboard & User Interface
 * 
 * Main entry point for the Finn Dashboard application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './app-router';

// Global Styles
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);
    color: #e0e6ff;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  /* Remove default scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(59, 130, 246, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.4);
  }

  /* Selection Color */
  ::selection {
    background: rgba(59, 130, 246, 0.3);
    color: #e0e6ff;
  }

  /* Focus Styles */
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

// Mount React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed - continue without PWA
    });
  });
}

export default AppRouter;
