import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have an index.css for global styles or Tailwind setup
import App from './app';

// Get the root element from your HTML (typically public/index.html)
const rootElement = document.getElementById('root');

// Create a root to render your React application
// This is the modern way to render React 18+ applications
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);