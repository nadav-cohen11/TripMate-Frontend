import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Router';
import { ToastContainer } from 'react-toastify';
import ToastConfig from './components/ui/ToastConfig';
import { AuthProvider } from './context/AuthContext';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer {...ToastConfig} />
    </AuthProvider>
  );
}

export default App;
