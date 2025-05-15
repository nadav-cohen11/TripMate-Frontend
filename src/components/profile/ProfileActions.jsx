import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileActions = ({ user, userId }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <button
        className="w-full bg-[#2D4A53] hover:bg-[#22343a] text-white px-6 py-2 rounded-xl transition text-lg font-semibold shadow mb-1 flex items-center justify-center"
        onClick={() => navigate(`/chat/${userId}`)}
      >
        <span className="text-2xl mr-2">💬</span>Chat with {user.name}
      </button>
      <button
        className="w-full bg-[#2D4A53] hover:bg-[#22343a] text-white px-6 py-2 rounded-xl transition text-lg font-semibold shadow flex items-center justify-center"
        onClick={() => alert('Connect request sent!')}
      >
        <span role="img" aria-label="connect" className="mr-2">🤝</span>Connect
      </button>
    </div>
  );
};

export default ProfileActions; 