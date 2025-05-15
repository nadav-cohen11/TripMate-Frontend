import React from 'react';
import { Link } from 'react-router-dom';

const FriendList = ({ friends }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <Link
          key={friend.id}
          to={`/profile/${friend.id}`}
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <img
            src={friend.profilePicture}
            alt={friend.name}
            className="w-10 h-10 rounded-full"
          />
          <span>{friend.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default FriendList; 