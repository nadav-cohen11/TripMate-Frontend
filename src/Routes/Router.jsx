import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import MultiStepFormRegister from '../pages/Auth/MultiStepFormRegister';
import protectedRoutes from './ProtectedRoutes';
import Navbar from '../components/ui/NavBar';
import MainPage from '../pages/Main/MainPage';
import NotFound from './NotFound';

const ProtectedLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AppRoutes = () => (
  <div className='pb-12 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200'>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<MultiStepFormRegister />} />
      <Route element={<ProtectedLayout />}>
        {protectedRoutes().map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  </div>
);

export default AppRoutes;
