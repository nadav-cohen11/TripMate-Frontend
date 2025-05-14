import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import AppRoutes from './Router';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GlobalProvider>
  );
}

export default App;
