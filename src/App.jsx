import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProfileSetup from './pages/ProfileSetUp';
import Home from './pages/Dashboard/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Dashboard/Map';
import Profile from './pages/Dashboard/Profile';
import Favorites from './pages/Dashboard/Favorites';
import { GlobalProvider } from './context/GlobalContext';
import ProtectedRoute from './components/ui/ProtectedRoute';

function App() {
  const protectedRoutes = [
    { path: '/home', component: <Home /> },
    { path: '/chat', component: <Chat /> },
    { path: '/map', component: <Map /> },
    { path: '/profile', component: <Profile /> },
    { path: '/favorites', component: <Favorites /> },
    { path: '/profileSetup', component: <ProfileSetup /> },
  ];

  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {protectedRoutes.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute>{component}</ProtectedRoute>}
            />
          ))}
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
