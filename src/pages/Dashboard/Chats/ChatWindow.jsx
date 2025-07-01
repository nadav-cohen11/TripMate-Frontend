import React, { useEffect, useState, useRef } from 'react';
import * as utils from './utils';
import GroupDetails from './GroupDetails';
import { translate } from '@/api/userApi';

const ChatWindow = ({
  selectedChat,
  message,
  userId,
  isGroupChat,
  socket,
  setChats,
  setMessage,
  setSelectedChatId,
  handleSendMessage,
}) => {
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [translatedMsgs, setTranslatedMsgs] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleGotBlocked = ({ userId: blockedUserId, chat }) => {
      setSelectedChatId(null);
      setChats((prev) =>
        prev.filter(
          (c) =>
            !c.isGroupChat &&
            !c.participants?.some((p) => p._id === blockedUserId),
        ),
      );
    };

    socket.on('gotBlocked', handleGotBlocked);
    return () => {
      socket.off('gotBlocked', handleGotBlocked);
    };
  }, [socket, setChats, setSelectedChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages?.length]);

  useEffect(() => {
    setShowGroupDetails(false);
  }, [selectedChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleLeaveTrip = () => {
    if (!window.confirm('Are you sure you want to leave this trip?')) return;

    socket.emit('leaveTrip', {
      tripId: selectedChat.tripId,
      chatId: selectedChat._id,
      userId,
    });

    setChats((prev) => {
      const filtered = prev.filter((c) => c._id !== selectedChat._id);
      setSelectedChatId(null);
      return filtered;
    });
  };

  let chatTitle = '';
  let participantsList = '';
  let otherUser = null;

  if (selectedChat) {
    if (isGroupChat) {
      chatTitle = selectedChat.chatName || 'Group Chat';
      participantsList =
        selectedChat.participants?.map((p) => p.fullName).join(', ') || '';
    } else {
      otherUser = selectedChat.participants?.find((p) => p._id !== userId);
      chatTitle = otherUser?.fullName || 'Chat';
    }
  }

  const handleBlockUser = () => {
    if (!otherUser) return;
    if (
      !window.confirm(`Are you sure you want to block ${otherUser.fullName}?`)
    )
      return;

    socket.emit('blockUser', {
      chatId: selectedChat._id,
      user1Id: userId,
      user2Id: otherUser._id,
    });

    setChats((prev) => {
      const filtered = prev.filter((c) => c._id !== selectedChat._id);
      setSelectedChatId(null);
      return filtered;
    });
  };

  const handleHeaderClick = () => {
    if (isGroupChat) setShowGroupDetails(true);
  };

  if (showGroupDetails && isGroupChat && selectedChat) {
    return (
      <GroupDetails
        group={selectedChat}
        socket={socket}
        onBack={() => setShowGroupDetails(false)}
        handleLeaveTrip={handleLeaveTrip}
      />
    );
  }

  if (!selectedChat) {
    return (
      <div className='flex flex-col items-center justify-center h-[80vh] min-h-[400px] w-full max-w-[800px] p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg'>
        <div className='text-[#4a90e2] text-lg font-medium text-center'>
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[80vh] min-h-[400px] w-full max-w-[800px] p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg'>
      {selectedChat && (
        <header
          onClick={handleHeaderClick}
          tabIndex={0}
          role='button'
          className='mb-4 border-b border-[#4a90e2]/20 pb-3 relative cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/50 rounded'
          aria-label={
            isGroupChat ? 'Open group details' : `Chat with ${chatTitle}`
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleHeaderClick();
            }
            }}
          >
            <div className='flex items-center justify-center'>
            {!isGroupChat && otherUser && (
              <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600 overflow-hidden mr-3'>
              {otherUser.photos?.length > 0 ? (
                <img
                src={otherUser.photos[0].url}
                className='rounded-full w-10 h-10 object-cover'
                alt={chatTitle}
                />
              ) : (
                otherUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
              )}
              </div>
            )}

            <h2 className='text-base sm:text-lg font-bold text-gray-900 text-center flex-1 truncate'>
              {chatTitle}
            </h2>
            {!isGroupChat && otherUser && (
              <button
              onClick={(e) => {
                  e.stopPropagation();
                  handleBlockUser();
                }}
                className='flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition'
                title={`Block ${otherUser.fullName}`}
                type='button'
                aria-label={`Block ${otherUser.fullName}`}
              >
                {utils.blockIcon}
                <span className='hidden sm:inline ml-1'>Block</span>
              </button>
            )}
          </div>
          {isGroupChat && (
            <p
              className='text-xs text-[#4a90e2]/70 text-center mt-1 truncate select-text'
              title={participantsList}
            >
              {participantsList}
            </p>
          )}
        </header>
      )}

      <main
        ref={messagesEndRef}
        className='flex-1 min-h-0 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#4a90e2]/20 scrollbar-track-gray-100 px-2'
        aria-live='polite'
        aria-relevant='additions'
      >
        {selectedChat &&
          selectedChat.messages &&
          Object.entries(utils.groupMessagesByDate(selectedChat.messages)).map(
            ([dateKey, msgs]) => (
              <section key={dateKey} aria-label={`Messages from ${dateKey}`}>
                <div className='flex justify-center my-4'>
                  <time
                    className='bg-[#4a90e2]/10 text-[#4a90e2] text-xs px-3 py-1 rounded-full select-none'
                    dateTime={dateKey}
                  >
                    {utils.formatDateHeader(dateKey)}
                  </time>
                </div>
                {msgs.map((msg, idx) => {
                  const isSender = msg.sender?._id === userId;
                  const time = msg.sentAt
                    ? new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '';

                  const translated = translatedMsgs[msg._id];
                  return (
                    <div
                      key={idx}
                      className={`my-2 ${
                        isSender ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block px-3 py-2 rounded-2xl min-w-[40px] max-w-[80vw] sm:max-w-[70%] break-words relative ${
                          isSender ? 'bg-[#4a90e2]/10' : 'bg-gray-100'

                        }`}
                        aria-label={`${msg.sender?.fullName} says: ${msg.content}`}
                      >
                        {isGroupChat && !isSender && (
                          <div className='text-xs font-semibold text-[#4a90e2] mb-1 select-text'>
                            {msg.sender?.fullName || 'System Suggestion'}
                          </div>
                        )}
                        <span className={isSender ? 'text-[#4a90e2]' : 'text-gray-800'}>
                          {msg.content}
                        </span>

                        <div className='flex justify-between mt-2 items-end gap-2'>
                          {!translated && (
                            <button
                              className='flex text-xs cursor-pointer text-[#4a90e2] hover:underline'
                              onClick={async () => {
                                const result = await translate(msg.content);
                                setTranslatedMsgs((prev) => ({
                                  ...prev,
                                  [msg._id]: result,
                                }));
                              }}
                              type='button'
                            >
                              Translate
                            </button>
                          )}

                          {translated && (
                            <span className='text-xs text-[#4a90e2]/70 italic ml-2'>
                              {translated}
                            </span>
                          )}
                          <time className='text-xs text-[#4a90e2]/50 select-none'>
                            {time}
                          </time>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            ),
          )}
      </main>

      <form
        onSubmit={handleSendMessage}
        className='flex gap-2 mt-auto pt-2 border-t border-[#4a90e2]/20'
      >
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 px-4 py-2 rounded-xl border border-[#4a90e2]/20 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/50 bg-white/50'
        />
        <button
          type='submit'
          disabled={!message.trim()}
          className='px-4 py-2 bg-[#4a90e2] text-white rounded-xl hover:bg-[#4a90e2]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
