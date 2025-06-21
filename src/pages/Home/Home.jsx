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
    toast.error(extractBackendError(err));
    throw err;
  }
};

const MAX_USERS = 10;
const Home = () => {
  const [swipeInfo, setSwipeInfo] = useState({ id: null, direction: null });
  const [openFilter, setIsOpenFilters] = useState(false);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filters, setFilters] = useState();
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
      setDisplayedUsers(usersWithAge.slice(0, MAX_USERS));
      setOriginalUsers(usersWithAge);
    }
  }, [users]);

  const handleSwipe = useCallback((dir, userId) => {
    setDisplayedUsers((prev) => prev.filter((u) => u._id != userId));
    setOriginalUsers((prev) => prev.filter((u) => u._id != userId));

    handleCardSwipe(dir, userId);
    setSwipeInfo({ id: userId, direction: dir });
    setTimeout(
      () => setSwipeInfo({ id: null, direction: null }),
      SWIPE_ANIMATION_DURATION,
    );
  }, []);

  const handleApplyFilters = (filter) => {
    setFilters(filter);
    setIsOpenFilters(false);
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

  if (!originalUsers.length || !displayedUsers.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 text-center text-gray-800'>
        <h1 className='text-2xl font-semibold'>
          No more matches at the moment!
        </h1>
        <p className='mt-2'>Check back later or adjust your preferences.</p>
        <button
          onClick={() => refetch()}
          className='mt-4 px-4 py-2 bg-white text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors'
        >
          Refresh
        </button>
      </div>
    );
  }

  const filteredUsers = displayedUsers.filter((user) => {
    if (!filters) return true;
    return Object.values(filters).every((filter) => {
      try {
        if (!filter.query || !filter.query.trim()) return true;
        const fn = new Function('user', `return ${filter.query};`);
        return fn(user);
      } catch (err) {
        toast.error(extractBackendError(err));
        return true;
      }
    });
  });

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
        {filteredUsers.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-center text-gray-800'>
            <h1 className='text-2xl font-semibold'>
              No users match your filters!
            </h1>
            <p className='mt-2'>Try adjusting your filters.</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Home);
