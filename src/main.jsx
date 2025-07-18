import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </QueryClientProvider>,
);
