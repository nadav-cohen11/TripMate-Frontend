import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoutes from './ProtectedRoutes';

const AppRoutes = () => (
  <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    {ProtectedRoutes()}
  </Routes>
);

export default AppRoutes