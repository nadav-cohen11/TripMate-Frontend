import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import TinderCard from 'react-tinder-card';
import ProfileCard from './ProfileCard';
import { NonMatchedUsers } from '../../api/matchApi';
import { extractBackendError } from '../../utils/errorUtils';
import { handleCardSwipe } from '../../utils/matchHandlersUtils';
import { getUserLocation } from '../../api/userApi';
import { calculateDistance } from '../../utils/calculateDistanceUtils';
import { useQuery } from '@tanstack/react-query';
import Typewriter from '../../components/animations/Typewriter';
import TripMateTitle from '@/components/ui/TripMateTitle';
import { Spinner } from '@/components/ui/spinner';

const STALE_TIME = 1000 * 60 * 5;
const SWIPE_ANIMATION_DURATION = 1000;
const COMPATIBILITY_THRESHOLD = 70;

const fetchUsers = async () => {
  try {
    const [displayUsers, currentUserLocation] = await Promise.all([
      NonMatchedUsers(),
      getUserLocation(),
    ]);

    return displayUsers.map((user) => {
      const compatibilityScore = user.compatibilityScore;
      const userCoords = user.location?.coordinates;
      const currentCoords = currentUserLocation?.location?.coordinates;

      const distance =
        Array.isArray(userCoords) && Array.isArray(currentCoords)
          ? calculateDistance(
              currentCoords[1],
              currentCoords[0],
              userCoords[1],
              userCoords[0],
            )
          : null;

      return {
        ...user,
        distance: distance ? Math.round(distance) : null,
        compatibilityScore,
        aiSuggested: compatibilityScore >= COMPATIBILITY_THRESHOLD,
      };
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

const Home = () => {
  const [swipeInfo, setSwipeInfo] = useState({ id: null, direction: null });

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users-with-location'],
    queryFn: fetchUsers,
    onError: (err) => toast.error(extractBackendError(err)),
    staleTime: STALE_TIME,
    retry: 2,
  });

  const handleSwipe = useCallback((dir, userId) => {
    handleCardSwipe(dir, userId);
    setSwipeInfo({ id: userId, direction: dir });
    setTimeout(() => setSwipeInfo({ id: null, direction: null }), SWIPE_ANIMATION_DURATION);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2">Please try again later</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800">
        <h1 className="text-2xl font-semibold">
          No more matches at the moment!
        </h1>
        <p className="mt-2">Check back later or adjust your preferences.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">
      <TripMateTitle />
      <div className="flex items-center justify-center min-h-screen px-4 z-10">
        {users.map((user, index) => (
          <TinderCard
            key={user._id}
            preventSwipe={['up', 'down']}
            className="absolute w-full h-full"
            onSwipe={(dir) => handleSwipe(dir, user._id)}
          >
            <div
              className="tinder-card-wrapper w-full h-full flex justify-center items-center px-4"
              style={{ zIndex: users.length - index }}
            >
              <ProfileCard user={user} swipeInfo={swipeInfo} />
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Home);
