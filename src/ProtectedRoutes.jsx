import React from 'react';
import {Route} from 'react-router-dom';
import ProfileSetup from './pages/ProfileSetUp';
import Home from './pages/Dashboard/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Dashboard/Map';
import Profile from './pages/Dashboard/Profile';
import Favorites from './pages/Dashboard/Favorites';
import ProtectedRoute from './components/ui/ProtectedRoute';

const protectedRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/chat', element: <Chat /> },
  { path: '/map', element: <Map /> },
  { path: '/profile', element: <Profile /> },
  { path: '/favorites', element: <Favorites /> },
  { path: '/profileSetup', element: <ProfileSetup /> },
];

const ProtectedRoutes = () => {
  return (
    <>
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}
    </>
  );
};

export default ProtectedRoutes;
