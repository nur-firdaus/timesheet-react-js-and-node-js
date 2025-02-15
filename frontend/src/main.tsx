import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Container/App'; // Import the App component

// Create a root element and render the App component
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);