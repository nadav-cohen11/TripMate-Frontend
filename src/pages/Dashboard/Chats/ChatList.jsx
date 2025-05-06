import React from 'react';
import { useState, useEffect } from 'react';
import { FriendsList } from './FriendsList';
const ChatList = ({
  chats,
  setChats,
  handleSelectedChatId,
  selectedChatId,
  userId,
  socket,
}) => {
  const [directChats, setDirectChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit('getConfirmedMatchesByUserId', { userId }, (matches) => {
        const newMatches = matches.filter((match) => {
          const otherUserId =
            match.user1Id._id === userId ? match.user2Id : match.user1Id;
          const alreadyInChat = chats.some((chat) => {
            return (
              !chat.isGroupChat &&
              chat.participants.some(
                (p) => String(p._id) === String(otherUserId._id),
              )
            );
          });

          return !alreadyInChat;
        });
        setMatches(newMatches);
      });
    }
  }, [socket, chats]);

  useEffect(() => {
    setDirectChats(chats.filter((c) => !c.isGroupChat));
    setGroupChats(chats.filter((c) => c.isGroupChat));
  }, [chats]);

  return (
    <div className='p-4 bg-gray-50 w-56 border-r border-gray-300 relative'>
      <div className='mb-6'>
        <FriendsList
          matches={matches}
          userId={userId}
          socket={socket}
          setChats={setChats}
        />
      </div>
      <h4 className='font-semibold text-gray-700 mb-2'>Direct Chats</h4>
      {directChats &&
        directChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleSelectedChatId(chat._id)}
            className={`px-3 py-2 mb-2 rounded-lg cursor-pointer transition-colors ${
              selectedChatId === chat._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            {(chat.participants &&
              chat.participants.filter((p) => p._id !== userId)[0]?.fullName) ||
              ''}
          </div>
        ))}
      <h4 className='font-semibold text-gray-700 mt-6'>Groups</h4>
      {groupChats &&
        groupChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleSelectedChatId(chat._id)}
            className={`px-3 py-2 mb-2 rounded-lg cursor-pointer transition-colors ${
              selectedChatId === chat._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            {chat.chatName || 'Group'}
          </div>
        ))}
    </div>
  );
};

export default ChatList;
