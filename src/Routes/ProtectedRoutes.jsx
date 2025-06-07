import Home from '../pages/Home/Home';
import Chat from '../pages/Dashboard/Chats/Chat';
import Map from '../pages/Map/Map';
import MyMatches from '../pages/Matches/MyMatches';
import ProtectedRoute from './ProtectedRoute'; 
import UploadMediaPage from '../pages/Auth/UploadMedia';
import ReelsPage from '../pages/Reels/Reels';
import UserProfilePage from '../pages/UserProfile/UserProfilePage';
import ProfileSetup from '@/pages/UserProfile/ProfileSetUp';

const protectedRoutes = () => [
  { path: '/home/', element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: '/chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: '/map', element: <ProtectedRoute><Map /></ProtectedRoute> },
  { path: '/reels', element: <ProtectedRoute><ReelsPage /></ProtectedRoute> },
  { path: '/setup', element: <ProtectedRoute><ProfileSetup /></ProtectedRoute> },
  { path: '/photos', element: <ProtectedRoute><UploadMediaPage /></ProtectedRoute> },
  { path: '/matches', element: <ProtectedRoute><MyMatches /></ProtectedRoute> },
  { path: '/profile/:userId', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
];

export default protectedRoutes;
