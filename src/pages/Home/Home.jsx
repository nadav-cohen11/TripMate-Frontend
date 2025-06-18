import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import TinderCard from 'react-tinder-card';
import ProfileCard from './ProfileCard';
import { getNonMatchedNearbyUsersWithReviews } from '../../api/matchApi';
import { extractBackendError } from '../../utils/errorUtils';
import { handleCardSwipe } from '../../utils/matchHandlersUtils';
import { getUserLocation } from '../../api/userApi';
import { calculateDistance } from '../../utils/calculateDistanceUtils';
import { useQuery } from '@tanstack/react-query';
import TripMateTitle from '@/components/ui/TripMateTitle';
import { Spinner } from '@/components/ui/spinner';
import HomeFilters from './HomeFilters';
const STALE_TIME = 1000 * 60 * 5;
const SWIPE_ANIMATION_DURATION = 1000;
const COMPATIBILITY_THRESHOLD = 70;

const fetchUsers = async () => {
  try {
    const [displayUsers, currentUserLocation] = await Promise.all([
      getNonMatchedNearbyUsersWithReviews(),
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
        reviews: user.reviews || [],
      };
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

const Home = () => {
  const [swipeInfo, setSwipeInfo] = useState({ id: null, direction: null });
  const [openFilter, setIsOpenFilters] = useState(false);
  const [filteredUsers, setFilterdUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

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

  useEffect(() => {
    const usersWithAge = users.map((user) => ({
      ...user,
      age: user.birthDate
        ? Math.floor(
            (Date.now() - new Date(user.birthDate).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25),
          )
        : null,
    }));

    const isSame =
      JSON.stringify(usersWithAge) === JSON.stringify(originalUsers);

    if (!isSame) {
      setFilterdUsers(usersWithAge);
      setOriginalUsers(usersWithAge);
    }
  }, [users]);

  const handleSwipe = useCallback((dir, userId) => {
    handleCardSwipe(dir, userId);
    setSwipeInfo({ id: userId, direction: dir });
    setTimeout(
      () => setSwipeInfo({ id: null, direction: null }),
      SWIPE_ANIMATION_DURATION,
    );
  }, []);

  function filterUsers(usersArr, selectedFilters) {
    const activeFilters = Object.values(selectedFilters).filter(
      (f) => f.query && f.query.trim(),
    );

    if (activeFilters.length === 0) return usersArr;

    return usersArr.filter((user) => {
      return activeFilters.every((filter) => {
        try {
          const fn = new Function('user', `return ${filter.query};`);
          return fn(user);
        } catch (e) {
          return true;
        }
      });
    });
  }

  const handleApplyFilters = (filter) => {
    setFilterdUsers(() => filterUsers(originalUsers, filter));
    setIsOpenFilters(false)
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800'>
        <h1 className='text-2xl font-semibold'>Something went wrong</h1>
        <p className='mt-2'>Please try again later</p>
      </div>
    );
  }

  if (!originalUsers.length || !filteredUsers.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800'>
        <h1 className='text-2xl font-semibold'>
          No more matches at the moment!
        </h1>
        <p className='mt-2'>Check back later or adjust your preferences.</p>
        <button
          onClick={() => refetch()}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden'>
      <TripMateTitle />
      <div className='absolute top-6 right-4 z-50'>
        <HomeFilters
          isOpen={openFilter}
          setIsOpen={setIsOpenFilters}
          handleApplyFilters={handleApplyFilters}
        />
      </div>

      <div className='flex items-center justify-center min-h-screen px-4 z-10'>
        {filteredUsers.map((user, index) => (
          <TinderCard
            key={user._id}
            preventSwipe={['up', 'down']}
            className='absolute w-full h-full'
            onSwipe={(dir) => handleSwipe(dir, user._id)}
          >
            <div
              className='tinder-card-wrapper w-full h-full flex justify-center items-center px-4'
              style={{ zIndex: filteredUsers.length - index }}
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
