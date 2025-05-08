import React from 'react';
import {Route } from 'react-router-dom';
import ProfileSetup from './pages/ProfileSetUp';
import Home from './pages/Dashboard/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Dashboard/Map';
import Profile from './pages/Dashboard/Profile';
import Favorites from './pages/Dashboard/Favorites';
import ProtectedRoute from './components/ui/ProtectedRoute';

const protectedRoutes = [
  { path: '/home', component: <Home /> },
  { path: '/chat', component: <Chat /> },
  { path: '/map', component: <Map /> },
  { path: '/profile', component: <Profile /> },
  { path: '/favorites', component: <Favorites /> },
  { path: '/profileSetup', component: <ProfileSetup /> },
];

const ProtectedRoutes = () => {
  return (
    <>
      {protectedRoutes.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{component}</ProtectedRoute>}
        />
      ))}
    </>
  );
};

export default ProtectedRoutes;
