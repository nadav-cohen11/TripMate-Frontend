import React from 'react';
import { useState, useEffect } from 'react';
import FriendsList from './FriendsList';
import CreateTrip from './CreateTrip';

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
    console.log(chats);
  }, [chats]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newTripCreated', ({ chat }) => {
      setChats((prev) => [...prev, chat]);
    });

    socket.on('newChatCreated', ({ chat }) => {
      setChats((prevChats) => [...prevChats, chat]);
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
        className='sm:hidden fixed top-4 right-4 z-30 bg-white/80 rounded-full p-2 shadow-md border border-blue-200'
        onClick={() => setShowSidebar((prev) => !prev)}
        aria-label='Toggle chat list'
      >
        <svg
          width='28'
          height='28'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M4 8h20M4 14h20M4 20h20' />
        </svg>
      </button>
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 border-r border-blue-200 shadow-xl transition-transform duration-200
          w-72 max-w-full p-6
          sm:static sm:translate-x-0 sm:w-64 sm:p-6
          flex flex-col
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '90vw' }}
      >
        <div className='mb-8 flex flex-col gap-2'>
          <div
            className='text-2xl font-bold text-blue-700 mb-6 tracking-wide'
            style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700 }}
          >
            Chats
          </div>
          <div className='flex gap-2.5 flex-col'>
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
        </div>
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <h4 className='font-semibold text-blue-800 mb-2 text-lg'>
            Direct Chats
          </h4>
          <div className='space-y-2'>
            {directChats &&
              directChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChatId(chat._id);
                    if (window.innerWidth < 640) setShowSidebar(false);
                  }}
                  className={`px-4 py-3 rounded-xl cursor-pointer transition-colors flex flex-col shadow-sm border border-blue-100
                    ${
                      selectedChatId === chat._id
                        ? 'bg-blue-200/80 border-blue-300'
                        : 'hover:bg-blue-100/60'
                    }`}
                >
                  <div className='font-medium truncate text-blue-900'>
                    {chat.participants?.find((p) => p._id !== userId)
                      ?.fullName || ''}
                  </div>
                  <div className='text-xs text-blue-600 truncate'>
                    {chat.lastMessagePreview}
                  </div>
                </div>
              ))}
          </div>
          <h4 className='font-semibold text-blue-800 mt-8 mb-2 text-lg'>
            Groups
          </h4>
          <div className='space-y-2'>
            {groupChats &&
              groupChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChatId(chat._id);
                    if (window.innerWidth < 640) setShowSidebar(false);
                  }}
                  className={`px-4 py-3 rounded-xl cursor-pointer transition-colors flex flex-col shadow-sm border border-blue-100
                    ${
                      selectedChatId === chat._id
                        ? 'bg-blue-200/80 border-blue-300'
                        : 'hover:bg-blue-100/60'
                    }`}
                >
                  <div className='font-medium truncate text-blue-900'>
                    {chat.chatName || 'Group'}
                  </div>
                  <div className='text-xs text-blue-600 truncate'>
                    {chat.lastMessagePreview}
                  </div>
                </div>
              ))}
          </div>
        </div>
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
