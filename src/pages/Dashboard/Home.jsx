import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import TinderCard from 'react-tinder-card';
import ProfileCard from '../../components/ProfileCard';
import { NonMatchedUsers } from '../../api/matchApi';
import { extractBackendError } from '../../utils/errorUtils';
import { handleCardSwipe } from '../../utils/matchHandlersUtils';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swipeInfo, setSwipeInfo] = useState({ id: null, direction: null });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const displayUsers = await NonMatchedUsers();
      const usersWithAI = displayUsers.map((user) => {
        const compatibilityScore = Math.floor(Math.random() * 101);
        return {
          ...user,
          compatibilityScore,
          aiSuggested: compatibilityScore >= 50,
        };
      });
      setUsers(usersWithAI);
    } catch (err) {
      toast.error(extractBackendError(err));
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-800">
        🔍 Searching for your next adventure...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg text-gray-800">
        <h1 className="text-2xl font-semibold">No more matches at the moment!</h1>
        <p className="mt-2">Check back later or adjust your preferences.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="absolute top-1 left-1 text-4xl text-black p-6 tracking-wide"
          style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
        >
          TripMate
        </div>

        {users.map((user, index) => (
          <TinderCard
            key={user._id}
            preventSwipe={['up', 'down']}
            className="absolute w-full h-full"
            onSwipe={(dir) => {
              handleCardSwipe(dir, user._id);
              setSwipeInfo({ id: user._id, direction: dir });
              setTimeout(() => setSwipeInfo({ id: null, direction: null }), 1000);
            }}
          >
            <div className="tinder-card-wrapper w-full h-full">
              <div
                className="pointer-events-auto w-full h-full flex justify-center items-center px-4"
                style={{ zIndex: users.length - index }}
              >
                <ProfileCard user={user} swipeInfo={swipeInfo} />
              </div>
            </div>
          </TinderCard>       
        ))}
      </div>
    </div>
  );
};

export default Home;
