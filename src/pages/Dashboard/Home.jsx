import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Navbar from '@/components/ui/NavBar';
import ProfileCard from '@/components/ui/ProfileCard';
import {getAllUsers} from "../../api/userApi.js";


const Home = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response.data, "nadav");
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182b31] pt-10">
      <div className="h-[500px] w-full max-w-sm relative flex items-center justify-center">
        {users.map((user, index) => (
          <TinderCard
            key={index}
            preventSwipe={['up', 'down']}
            className="absolute"
          >
            <ProfileCard
              name={user.name}
            //   location={user.location}
              bio={user.bio}
              imageUrl={user.photos[0]}
            />
          </TinderCard>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
