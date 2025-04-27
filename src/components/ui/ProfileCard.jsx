// src/components/ui/ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ name, location, bio, imageUrl }) => {
  return (
    <div className="flex flex-col bg-[#182b31] text-white items-center rounded-3xl shadow-lg overflow-hidden w-[350px]">
      {/* Profile Picture Area */}
      <div
        className="h-[400px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Information Area */}
      <div className="flex flex-col items-center p-6 space-y-4 pb-10 w-full">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-400">{location}</p>
        <p className="text-center text-gray-300">{bio}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
