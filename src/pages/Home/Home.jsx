import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import TinderCard from 'react-tinder-card';
import ProfileCard from './ProfileCard';
import { NonMatchedUsers } from '../../api/matchApi';
import { extractBackendError } from '../../utils/errorUtils';
import { handleCardSwipe } from '../../utils/matchHandlersUtils';
import { getUserLocation } from '../../api/userApi';
import { calculateDistance } from '../../utils/calculateDistanceUtils';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import ErrorBoundary from '../../components/ErrorBoundary';

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
      const compatibilityScore = user.compatibilityScore
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

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
    <Spinner size={50} color="text-blue-500" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800">
    <h1 className="text-2xl font-semibold">No more matches at the moment!</h1>
    <p className="mt-2">Check back later or adjust your preferences.</p>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
    <p className="text-red-500 mb-4">Something went wrong. Please try again.</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

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

  if (!users.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800'>
        <h1 className='text-2xl font-semibold'>
          No more matches at the moment!
        </h1>
        <p className='mt-2'>Check back later or adjust your preferences.</p>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden'>
      <div
        className='absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide'
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
      >
        TripMate
      </div>
      <div className='flex items-center justify-center min-h-screen px-4 z-10'>
        {users.map((user, index) => (
          <TinderCard
            key={user._id}
            preventSwipe={['up', 'down']}
            className='absolute w-full h-full'
            onSwipe={(dir) => {
              handleCardSwipe(dir, user._id);
              setSwipeInfo({ id: user._id, direction: dir });
              setTimeout(
                () => setSwipeInfo({ id: null, direction: null }),
                1000,
              );
            }}
          >
            <div
              className='tinder-card-wrapper w-full h-full flex justify-center items-center px-4'
              style={{ zIndex: users.length - index }}
            >
              <div
                className="tinder-card-wrapper w-full h-full flex justify-center items-center px-4"
                style={{ zIndex: memoizedUsers.length - index }}
              >
                <ProfileCard user={user} swipeInfo={swipeInfo} />
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(Home);
