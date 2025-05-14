import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import TinderCard from 'react-tinder-card';
import Navbar from '@/components/ui/NavBar';
import ProfileCard from '@/components/ui/ProfileCard';
import { NonMatchedUsers } from '../../api/matchApi';
import { calculateAge } from '../../utils/userUtils';
import { handleSwipe } from '../../utils/matchHandlersUtils';
import { extractBackendError } from '../../utils/errorUtils'

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await NonMatchedUsers();
      setUsers(data);
    } catch (err) {
      const message = extractBackendError(err);
      toast.error(message); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182b31] pt-10">
      <div className="h-[500px] w-full max-w-sm relative flex items-center justify-center">
        {users.map((user) => (
          <TinderCard
            key={user._id}
            preventSwipe={['up', 'down']}
            className="absolute"
            onSwipe={(dir) => handleSwipe(dir, user._id)}
          >
            <ProfileCard
              name={user.fullName}
              age={calculateAge(user.birthDate)}
              location={user.location}
              bio={user.bio}
              imageUrl={user.photos?.[0] ?? '/assets/images/logo2.jpg'}
            />
          </TinderCard>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
