import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../api/userApi';
import { toast } from 'react-toastify';
import ProfileImage from '../Home/ProfileImage';
import PhotoNavigation from '../Home/PhotoNavigation';
import ProfileDetails from '../Home/ProfileDetails';
import UserQRCode from './UserQRCode';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [photoIndex, setPhotoIndex] = useState(0);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    onError: () => toast.error('Failed to load user profile.'),
  });

  const nextPhoto = () =>
    setPhotoIndex((prev) => (prev + 1) % (user?.photos?.length || 1));
  const prevPhoto = () =>
    setPhotoIndex((prev) =>
      (prev - 1 + (user?.photos?.length || 1)) % (user?.photos?.length || 1)
    );

  const travel = user?.travelPreferences || {};
  const languages = user?.languagesSpoken?.join(', ') || '';
  const country = user?.location?.country || '';
  const city = user?.location?.city || '';
  const photo =
    user?.photos?.[photoIndex]?.url || '/assets/images/Annonymos_picture.jpg';

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
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">

      <div className="absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}>
        TripMate
      </div>
      <IoSettingsOutline className="absolute top-6 right-6 text-4xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center mt-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-lg overflow-hidden">
            <ProfileImage photo={photo} photoIndex={photoIndex} />
            <PhotoNavigation
              user={user}
              photoIndex={photoIndex}
              nextPhoto={nextPhoto}
              prevPhoto={prevPhoto}
              setPhotoIndex={setPhotoIndex}
            />
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col gap-8 relative">
          <div className="absolute top-4 right-4">
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
    </div>
  );
};

export default UserProfilePage;
