import React from 'react';
import { useState, useEffect } from 'react';
import { FriendsList } from './FriendsList';
import { CreateTrip } from './CreateTrip';

const ChatList = ({
  chats,
  selectedChatId,
  userId,
  socket,
  setSelectedChatId,
  setChats,
}) => {
  const [directChats, setDirectChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchesWithoutChat, setMatchesWithoutChat] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

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
      socket.off('newChatCreated');
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <button
        className='sm:hidden fixed top-4 right-4 z-30 bg-white border rounded-md p-2 shadow'
        onClick={() => setShowSidebar((prev) => !prev)}
        aria-label='Toggle chat list'
      >
        <svg
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>
      <div
        className={`
          fixed top-0 left-0 h-full z-20 bg-gray-50 border-r border-gray-300 transition-transform duration-200
          w-64 max-w-full p-4
          sm:static sm:translate-x-0 sm:w-56 sm:p-4
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '90vw' }}
      >
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
              onClick={() => {
                setSelectedChatId(chat._id);
                if (window.innerWidth < 640) setShowSidebar(false);
              }}
              className={`px-3 py-2 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedChatId === chat._id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className='font-medium truncate'>
                {chat.participants?.find((p) => p._id !== userId)?.fullName ||
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
              onClick={() => {
                setSelectedChatId(chat._id);
                if (window.innerWidth < 640) setShowSidebar(false);
              }}
              className={`px-3 py-2 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedChatId === chat._id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
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
      {showSidebar && (
        <div
          className='fixed inset-0 z-10 sm:hidden'
          style={{
            background: 'rgb(28 25 25 / 42%)',
          }}
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default ChatList;
