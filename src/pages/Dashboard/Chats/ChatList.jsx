import React from 'react';
import { useState, useEffect } from 'react';
import { FriendsList } from './FriendsList';
import { CreateTrip } from './CreateTrip';
const ChatList = ({
  chats,
  selectedChatId,
  userId,
  socket,
  handleSelectedChatId,
  setChats,
}) => {
  const [directChats, setDirectChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchesWithoutChat, setMatchesWithoutChat] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newTripCreated', ({ chats }) => {
      setChats(chats);
    });

    socket.on('newChatCreated', ({ chats }) => {
      setChats(chats);
    });

    return () => {
      socket.off('newTripCreated');
    };
  }, [socket]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit('getConfirmedMatchesByUserId', { userId }, (matches) => {
        setMatches(matches);
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
        setMatchesWithoutChat(newMatches);
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
          matches={matchesWithoutChat}
          userId={userId}
          socket={socket}
          setChats={setChats}
        />

        <CreateTrip
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
            <div className='font-medium truncate'>
              {(chat.participants &&
                chat.participants.filter((p) => p._id !== userId)[0]
                  ?.fullName) ||
                ''}
            </div>
            <div className='text-xs text-gray-500 truncate'>
              {chat.lastMessagePreview}
            </div>
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
            <div className='font-medium truncate'>
              {chat.chatName || 'Group'}
            </div>
            <div className='text-xs text-gray-500 truncate'>
              {chat.lastMessagePreview}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
