import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Chat from './pages/Dashboard/Chats/Chat';
import { GlobalProvider } from './context/GlobalContext';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {ProtectedRoutes()}
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
