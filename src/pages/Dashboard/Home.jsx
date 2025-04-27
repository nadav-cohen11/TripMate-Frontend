import React from 'react';
import TinderCard from 'react-tinder-card';
import Navbar from '@/components/ui/NavBar';
import ProfileCard from '@/components/ui/ProfileCard';

const users = [
  {
    name: 'Elisa Perryson',
    location: 'San Francisco, USA',
    bio: "Hi! I'm Elisa. I love exploring new places, trying different foods, and meeting amazing people. Let's connect!",
    imageUrl: '/assets/images/headshot.jpg',
  },
];

const Home = () => {
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
              location={user.location}
              bio={user.bio}
              imageUrl={user.imageUrl}
            />
          </TinderCard>
        ))}
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
