import Home from './pages/Home/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Map/Map';
import Profile from './pages/Dashboard/Profile';
import Favorites from './pages/Dashboard/Favorites';
import ProfileSetup from './pages/ProfileSetUp';
import ProtectedRoute from './components/ProtectedRoute';
import MyMatches from './pages/Matches/MyMatches';

const protectedRoutes = () => [
  {
    path: '/home/*',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: '/map',
    element: (
      <ProtectedRoute>
        <Map />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/*',
    element: (
      <ProtectedRoute>
        <Profile mode='update' />
      </ProtectedRoute>
    ),
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <Favorites />
      </ProtectedRoute>
    ),
  },
  {
    path: '/setup',
    element: (
      <ProtectedRoute>
        <ProfileSetup />
      </ProtectedRoute>
    ),
  },

  {
    path: '/m',
    element: (
      <ProtectedRoute>
        <MyMatches />
      </ProtectedRoute>
    ),
  },
];

export default protectedRoutes;
