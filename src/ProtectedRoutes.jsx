import Home from './pages/Home/Home';
import Chat from './pages/Dashboard/Chats/Chat';
import Map from './pages/Map/Map';
import ProtectedRoute from './components/ProtectedRoute'; 
import UploadTestPage from './pages/test/UploadTestPage';
import ReelsPage from './pages/Reels/Reels';
import UserProfilePage from './pages/UserProfile/UserProfilePage';

const protectedRoutes = () => [
  { path: '/home/', element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: '/chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: '/map', element: <ProtectedRoute><Map /></ProtectedRoute> },
  { path: '/reels', element: <ProtectedRoute><ReelsPage /></ProtectedRoute> },
  { path: '/setup', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
  { path: '/test', element: <ProtectedRoute><UploadTestPage /></ProtectedRoute> },
  { path: '/profile/:userId', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
];

export default protectedRoutes;
