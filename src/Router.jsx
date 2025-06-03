import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Auth/Login';
import MultiStepFormRegister from './pages/Auth/MultiStepFormRegister';
import protectedRoutes from './ProtectedRoutes';
import Navbar from './components/ui/NavBar';
import LoadingPage from './pages/LoadingPage';
import MyMatches from './pages/Matches/MyMatches';

const ProtectedLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoadingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path='/register' element={<MultiStepFormRegister />} />
    <Route element={<ProtectedLayout />} >
    {protectedRoutes().map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
    </Route>
  </Routes>
);

export default AppRoutes;
