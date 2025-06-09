import React from 'react';
import { useParams } from 'react-router-dom';
import { IoSettingsOutline, IoPencil } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../api/userApi';
import { toast } from 'react-toastify';
import ProfileImage from '../Home/ProfileImage';
import ProfileDetails from '../Home/ProfileDetails';
import UserQRCode from './UserQRCode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    retry: 1,
    onError: () => toast.error('Failed to load user profile.'),
  });

  const travel = userProfile?.travelPreferences || {};
  const languages = userProfile?.languagesSpoken?.join(', ') || '';
  const country = userProfile?.location?.country || '';
  const city = userProfile?.location?.city || '';
  const photo =
    userProfile?.photos?.[0]?.url || '/assets/images/Annonymos_picture.jpg';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="text-blue-600 text-lg font-medium animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg font-semibold">User not found.</div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden flex flex-col items-center py-12'>
      <header>
        <div
          className='absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide'
          style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
        >
          TripMate
        </div>
        {userId === user && (
          <div className="absolute top-6 right-6 flex gap-4 z-50">
            <button
              onClick={() => navigate('/setup')}
              className="p-2 rounded-full hover:bg-gray-100 transition duration-150"
            >
              <IoSettingsOutline className="text-4xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200" />
            </button>
          </div>
        )}
      </header>
      <div className='w-full max-w-sm space-y-6 mt-20 mb-8'>
        <div className='bg-white rounded-3xl border border-blue-100 shadow-lg overflow-hidden relative'>
           {userId === user && (
              <button
                onClick={() => navigate('/photos', { state: { photos: userProfile.photos, reels: userProfile.reels } })}
                className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100 transition duration-150 z-10"
              >
                <IoPencil className="text-black-600 text-lg" />
              </button>
            )}
          <ProfileImage photo={photo} />
        </div>
      </div>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col gap-8 relative'>
        <div className='absolute top-4 right-4'>
          <UserQRCode />
        </div>
        <ProfileDetails
          user={user}
          age={user.age}
          country={country}
          city={city}
          languages={languages}
          travel={travel}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
