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
  isSidebarOpen,
  onCloseSidebar,
}) => {
  const [directChats, setDirectChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchesWithoutChat, setMatchesWithoutChat] = useState([]);


  useEffect(() => {
    if (!socket) return;

    socket.on('newTripCreated', ({ chat }) => {
      setChats((prev) => [...prev, chat]);
    });

    socket.on('newChatCreated', ({ chat }) => {
      setChats((prevChats) => [...prevChats, chat]);
    });

    return () => {8
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

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 border-r border-[#4a90e2]/20 shadow-xl transition-transform duration-200
          w-full max-w-[320px] p-4 sm:p-6
          sm:static sm:translate-x-0 sm:w-full sm:shadow-none
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className='mb-6 flex flex-col gap-2'>
          <div
            className='text-2xl font-bold text-[#4a90e2] mb-4 tracking-wide'
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
        <div className='flex-1 min-h-0 overflow-y-auto pr-2 space-y-6'>
          <section>
            <h4 className='font-semibold text-[#4a90e2] mb-3 text-lg'>
              Direct Chats
            </h4>
            <div className='space-y-2'>
              {directChats &&
                directChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChatId(chat._id);
                      if (window.innerWidth < 640) onCloseSidebar();
                    }}
                    className={`px-4 py-3 rounded-xl cursor-pointer transition-colors flex flex-col shadow-sm border border-[#4a90e2]/20
                      ${
                        selectedChatId === chat._id
                          ? 'bg-[#4a90e2]/10 border-[#4a90e2]/30'
                          : 'hover:bg-[#4a90e2]/5'
                      }`}
                  >
                    <div className='font-medium truncate text-[#4a90e2]'>
                      {chat.participants?.find((p) => p._id !== userId)
                        ?.fullName || ''}
                    </div>
                    <div className='text-xs text-[#4a90e2]/70 truncate'>
                      {chat.lastMessagePreview}
                    </div>
                  </div>
                ))}
            </div>
          </section>
          <section>
            <h4 className='font-semibold text-[#4a90e2] mb-3 text-lg'>
              Groups
            </h4>
            <div className='space-y-2'>
              {groupChats &&
                groupChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChatId(chat._id);
                      if (window.innerWidth < 640) onCloseSidebar();
                    }}
                    className={`px-4 py-3 rounded-xl cursor-pointer transition-colors flex flex-col shadow-sm border border-[#4a90e2]/20
                      ${
                        selectedChatId === chat._id
                          ? 'bg-[#4a90e2]/10 border-[#4a90e2]/30'
                          : 'hover:bg-[#4a90e2]/5'
                      }`}
                  >
                    <div className='font-medium truncate text-[#4a90e2]'>
                      {chat.chatName || 'Group'}
                    </div>
                    <div className='text-xs text-[#4a90e2]/70 truncate'>
                      {chat.lastMessagePreview}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-10 sm:hidden bg-black/40 backdrop-blur-sm'
          onClick={onCloseSidebar}
        />
      )}
    </>
  );
};

export default ChatList;
