import React, { useEffect, useState } from 'react';
import * as utils from './utils';
import GroupDetails from './GroupDetails';

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
  const messagesEndRef = React.useRef(null);



  useEffect(() => {
    if (socket) {
      socket.on('gotBlocked', ({ userId, chat }) => {
        setSelectedChatId(null)
        setChats((prev) => {
          return prev.filter((c) => {
            return (
              !c.isGroupChat && !c.participants?.some((p) => p._id === userId)
            );
          });
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages?.length]);

  useEffect(() => {
    setShowGroupDetails(false);
  }, [selectedChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  const handleLeaveTrip = () => {
    const confirmation = confirm('Are you sure you want to leave this trip?');
    if (!confirmation) return;

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
  let participantsList = [];
  let otherUser = null;
  if (selectedChat) {
    if (isGroupChat) {
      chatTitle = selectedChat.chatName || 'Group Chat';
      participantsList = selectedChat.participants
        ? selectedChat.participants.map((p) => p.fullName).join(', ')
        : '';
    } else {
      otherUser = selectedChat.participants?.find((p) => p._id !== userId);
      chatTitle = otherUser?.fullName || 'Chat';
    }
  }

  const handleBlockUser = () => {
    if (otherUser) {
      const comfirmation = confirm(
        `Are you sure you want to block ${otherUser.fullName}?`,
      );
      if (!comfirmation) return;
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
    }
  };

  const handleHeaderClick = () => {
    if (isGroupChat) {
      setShowGroupDetails(true);
    }
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

  return (
    <div className='flex flex-col h-[80vh] min-h-[400px] max-w-[500px] mx-auto my-10 p-4 bg-white rounded-xl shadow-md'>
      {selectedChat && (
        <div
          className={`mb-4 border-b pb-2 relative cursor-pointer transition`}
          onClick={handleHeaderClick}
          tabIndex={0}
          role='button'
        >
          <div className='flex items-center justify-center'>
            <div className='text-lg font-bold text-gray-800 text-center flex-1'>
              {chatTitle}
            </div>
            {!isGroupChat && otherUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlockUser();
                }}
                className='absolute right-0 top-0 flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition'
                title={`Block ${otherUser.fullName}`}
                type='button'
              >
                {utils.blockIcon}
                Block
              </button>
            )}
          </div>
          {isGroupChat && (
            <div className='text-xs text-gray-500 text-center mt-1'>
              {participantsList}
            </div>
          )}
        </div>
      )}

      <div className='flex-1 min-h-0 mb-4 overflow-y-auto' ref={messagesEndRef}>
        {selectedChat &&
          selectedChat.messages &&
          Object.entries(utils.groupMessagesByDate(selectedChat.messages)).map(
            ([dateKey, msgs]) => (
              <div key={dateKey}>
                <div className='flex justify-center my-4'>
                  <span className='bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                    {utils.formatDateHeader(dateKey)}
                  </span>
                </div>
                {msgs.map((msg, idx) => {
                  let time = '';
                  if (msg.sentAt) {
                    const date = new Date(msg.sentAt);
                    time = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });
                  }
                  return (
                    <div
                      key={idx}
                      className={`my-2 ${
                        msg.sender._id === userId ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span
                        className={`inline-block px-3 py-2 rounded-2xl min-w-[40px] relative ${
                          msg.sender._id === userId
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {isGroupChat && msg.sender._id !== userId && (
                          <div className='text-xs font-semibold text-blue-700 mb-1'>
                            {msg.sender.fullName}
                          </div>
                        )}
                        {msg.content}
                        {time && (
                          <div className='text-xs text-gray-500 mt-1 text-right'>
                            {time}
                          </div>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ),
          )}
      </div>
      {selectedChat && (
        <form
          onSubmit={handleSendMessage}
          className='flex mt-auto pt-2 border-t border-gray-200 bg-white'
        >
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 px-3 py-2 rounded-2xl border border-gray-300 focus:outline-none'
          />
          <button
            type='submit'
            className='ml-2 px-4 py-2 rounded-2xl border-none bg-blue-600 text-white'
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;
