import Home from './pages/Home/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Map/Map';
import Profile from './pages/Dashboard/Profile';
import Favorites from './pages/Dashboard/Favorites';
import ProfileSetup from './pages/ProfileSetUp';
import ProtectedRoute from './components/ProtectedRoute'; 

const protectedRoutes = () => [
  { path: '/home/*', element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: '/chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: '/map', element: <ProtectedRoute><Map /></ProtectedRoute> },
  { path: '/profile/*', element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: '/favorites', element: <ProtectedRoute><Favorites /></ProtectedRoute> },
  { path: '/setup', element: <ProtectedRoute><ProfileSetup /></ProtectedRoute> },
];

export default protectedRoutes;
