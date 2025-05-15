import React from 'react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6 w-full">
      <img
        src={user.profilePicture}
        alt=""
        className="w-40 h-40 rounded-full object-cover border-4 border-[#2D4A53] shadow-lg bg-orange-100 mx-auto"
        style={{ display: 'block' }}
      />
      <h2 className="text-3xl font-bold mt-4 mb-1 text-center">{user.name}</h2>
      <p className="text-gray-600 mb-2 text-base sm:text-lg text-center">{user.bio}</p>
    </div>
  );
};

export default ProfileHeader; 