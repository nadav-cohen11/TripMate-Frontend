import React, { useEffect } from 'react';
import { formatDateHeader, groupMessagesByDate } from './dateUtils';

const ChatWindow = ({
  selectedChat,
  message,
  setMessage,
  handleSendMessage,
  userId,
  isGroupChat,
}) => {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChat?.messages?.length]);

  return (
    <div className='flex flex-col h-[80vh] min-h-[400px] max-w-[500px] mx-auto my-10 p-4 bg-white rounded-xl shadow-md'>
      <div className='flex-1 min-h-0 mb-4 overflow-y-auto' ref={messagesEndRef}>
        {selectedChat &&
          selectedChat.messages &&
          Object.entries(groupMessagesByDate(selectedChat.messages)).map(
            ([dateKey, msgs]) => (
              <div key={dateKey}>
                <div className='flex justify-center my-4'>
                  <span className='bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                    {formatDateHeader(dateKey)}
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
                        msg.sender === userId ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span
                        className={`inline-block px-3 py-2 rounded-2xl min-w-[40px] relative ${
                          msg.sender === userId ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {isGroupChat && msg.sender !== userId && (
                          <div className='text-xs font-semibold text-blue-700 mb-1'>
                            {selectedChat.participants.find(
                              (p) => p._id === msg.sender,
                            )?.fullName || 'Unknown'}
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
