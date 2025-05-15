import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProfileSetup from '../pages/ProfileSetUp';
import Home from '../pages/Dashboard/Home';
import Chat from '../pages/Dashboard/Chat';
import Map from '../pages/Dashboard/Map';
import Profile from '../pages/Dashboard/Profile';
import Favorites from '../pages/Dashboard/Favorites';
import Settings from '../pages/Dashboard/Settings';

const AppRoutes = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/map" element={<Map />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 