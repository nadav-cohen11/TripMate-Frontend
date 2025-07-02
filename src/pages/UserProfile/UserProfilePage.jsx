import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoSettingsOutline, IoPencil } from 'react-icons/io5';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserById, getUserWithReviews } from '../../api/userApi';
import { createOrAcceptMatch } from '../../api/matchApi';
import { toast } from 'react-toastify';
import ProfileImage from '../Home/ProfileImage';
import ProfileDetails from '../Home/ProfileDetails';
import UserQRCode from './UserQRCode';
import TripMateTitle from '@/components/ui/TripMateTitle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Users } from 'lucide-react';
import useFetchMyMatches from '@/hooks/useFetchMyMatches';

import { confirmToast } from '@/components/ui/ToastConfirm';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { matches, pendingMatches } = useFetchMyMatches();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserWithReviews(),
    enabled: !!userId,
    retry: 1,
    onError: () => toast.error('Failed to load user profile.'),
  });

  const travel = userProfile?.travelPreferences || {};
  const languages = userProfile?.languages || [];
  const country = userProfile?.location?.country || '';
  const city = userProfile?.location?.city || '';
  const cloudinaryBaseUrl = `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload/`;
  const photo = userProfile?.profilePhotoId
    ? `${cloudinaryBaseUrl}${userProfile.profilePhotoId}`
    : userProfile?.photos?.[0]?.url || '/assets/images/Annonymos_picture.jpg';

  const handleSignOut = async () => {
    const confirm = await confirmToast(
      'Are you sure you want to sign out?',
      'red',
    );
    if (!confirm) return;
    await signOut();
    navigate('/');
  };

  const sendMatchMutation = useMutation({
    mutationFn: ({ user2Id }) => createOrAcceptMatch({ user2Id }),
    onSuccess: () => toast.info(`Your match was sent`),
    onError: (error) => {
      if (error.status === 409) {
        toast.error('You already have match');
      } else {
        toast.error('Something went wrong');
      }
    },
  });

  const handleSendMatch = async (userId) => {
    const confirmation = await confirmToast(
      `You confirm to send this match with ${userProfile.fullName}?`,
    );
    if (!confirmation) return;
    sendMatchMutation.mutate({ user2Id: userId });
  };

  const userQRCodeComponent = <UserQRCode />;

  const matchMeButton = (
    <button
      onClick={() => handleSendMatch(userId)}
      className='w-3/4 mx-auto group relative flex items-center justify-center px-3 py-2 bg-white border border-[#4a90e2]/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
    >
      <div className='flex items-center gap-2'>
        <div className='relative shrink-0'>
          <Users className='text-xl text-[#4a90e2]' />
        </div>
        <div className='flex flex-col items-start min-w-0'>
          <span className='text-[#4a90e2] text-sm font-medium whitespace-normal break-words w-full'>
            Match me
          </span>
        </div>
      </div>
    </button>
  );

  const myMatchesButton = (
    <button
      onClick={() => navigate('/matches')}
      className='w-3/4 mx-auto group relative flex items-center justify-center px-3 py-2 bg-white border border-[#4a90e2]/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
    >
      <div className='flex items-center gap-2'>
        <div className='relative shrink-0'>
          <Users className='text-xl text-[#4a90e2]' />
          {pendingMatches?.length > 0 && (
            <div className='absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center'>
              <span className='text-[10px] font-bold text-white'>
                {pendingMatches.length}
              </span>
            </div>
          )}
        </div>
        <div className='flex flex-col items-start min-w-0'>
          <span className='text-[#4a90e2] text-sm font-medium whitespace-normal break-words w-full'>
            My Matches
          </span>
          <span className='text-[#4a90e2]/80 text-xs whitespace-normal break-words w-full'>
            {matches?.length || 0} confirmed
          </span>
        </div>
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-sky-100'>
        <div className='text-blue-600 text-lg font-medium animate-pulse'>
          Loading profile...
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='text-red-500 text-lg font-semibold'>
          User not found.
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden flex flex-col items-center py-12'>
      <TripMateTitle />
      {userId === user && (
        <div className='absolute top-6 right-6 flex items-center gap-3 z-50'>
          <button
            onClick={() => navigate('/setup', { state: { photo: photo } })}
            className='p-2 rounded-full hover:bg-gray-100 transition duration-150 group relative'
          >
            <IoSettingsOutline className='text-4xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200' />
            <span className='absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
              Edit Profile
            </span>
          </button>
          <button
            onClick={handleSignOut}
            className='group relative flex items-center justify-center gap-2 w-12 h-12 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-pink-500 shadow-lg hover:from-red-500 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300'
          >
            <LogOut className='text-white text-2xl' />
            <span className='sr-only'>Log out</span>
            <span className='absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
              Log out of your account
            </span>
          </button>
        </div>
      )}

      <div className='w-full max-w-sm space-y-6 mt-20 mb-8'>
        <div className='bg-white rounded-3xl border border-blue-100 shadow-lg overflow-hidden relative mx-auto max-w-sm sm:max-w-md md:max-w-lg'>
          {userId === user && (
            <button
              onClick={() =>
                navigate('/photos', {
                  state: {
                    photos: userProfile.photos,
                    reels: userProfile.reels,
                  },
                })
              }
              className='absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100 transition duration-150 z-10'
            >
              <IoPencil className='text-black-600 text-lg' />
            </button>
          )}
         

          <div className='w-full'>
            <ProfileImage photo={photo} />
          </div>
          {userId === user && (
            <div className='w-full flex justify-center my-4'>
              {myMatchesButton}
            </div>
          )}
          <div className='w-full p-4 sm:p-8 flex flex-col gap-8 relative'>
            {userId === user && (
              <div className='absolute top-13 right-8'>{userQRCodeComponent}</div>
            )}
            <ProfileDetails
              user={{
                ...userProfile,
                languages 
              }}
              birthDate={userProfile.birthDate}
              city={city}
              country={country}
              travel={travel}
              distance={userProfile.distance}
              compatibilityScore={userProfile.compatibilityScore}
              gender={userProfile.gender}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserProfilePage;
