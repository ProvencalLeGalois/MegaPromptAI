
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("L'élément #root est introuvable.");
} else {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
