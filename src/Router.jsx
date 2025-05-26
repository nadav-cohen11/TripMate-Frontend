import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import MultiStepFormRegister from './pages/Auth/MultiStepFormRegister';
import protectedRoutes from './ProtectedRoutes';

const ProtectedLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path='/register' element={<MultiStepFormRegister />} />
    {protectedRoutes().map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AppRoutes;
