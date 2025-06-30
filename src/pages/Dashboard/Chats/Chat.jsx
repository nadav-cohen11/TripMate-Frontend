import React, { useEffect, useState, useContext } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useChatSocket from '@/hooks/useChatSocket';
import { AuthContext } from '@/context/AuthContext';
import TripMateTitle from '@/components/ui/TripMateTitle';
import { useLocation } from 'react-router-dom';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState();
  const { user } = useContext(AuthContext);
  const userId = user;
  const socketInstance = useChatSocket(userId, setChats);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const { group, msg } = location.state || {};

  useEffect(() => {
    if (group) setSelectedChatId(group._id);
    if (msg) {
      setMessage(`${msg.title}, ${msg.text}`);
    }
  }, [group,msg]);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      const directChat = chats.find((chat) => !chat.isGroupChat);
      setSelectedChatId(directChat ? directChat._id : chats[0]._id);
    }
  }, [chats]);

  useEffect(() => {
    if (socketInstance && selectedChatId) {
      socketInstance.emit('joinRoom', { chatId: selectedChatId });
    }
  }, [selectedChatId, socketInstance]);

  useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on('messageReceived', handleMessageReceived);
    return () => {
      socketInstance.off('messageReceived', handleMessageReceived);
    };
  }, [socketInstance]);

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    if (socketInstance && message.trim() && selectedChatId) {
      const msg = { content: message, sentAt: new Date() };
      socketInstance.emit('sendMessage', {
        room: selectedChatId,
        sender: userId,
        msg,
      });
      setMessage('');
    }
  };

  const handleMessageReceived = (msg) => {
    setChats((prev) =>
      prev.map((chat) =>
        String(chat._id) === String(msg.chatId)
          ? {
              ...chat,
              messages: [...(chat.messages || []), msg],
              lastMessagePreview: msg.content,
            }
          : chat,
      ),
    );
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden'>
      <TripMateTitle />
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='sm:hidden fixed top-4 right-4 z-30 bg-white/80 rounded-full p-2 shadow-md border border-[#4a90e2]/20'
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
      <div className='flex flex-col-reverse sm:flex-row min-h-screen pt-20 sm:pt-24 px-2 sm:px-4 lg:px-12 gap-2 sm:gap-6 pb-24'>
        <div
          className={`
            w-full sm:w-1/3 max-w-full
            fixed inset-y-0 left-0 z-20 sm:static
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 sm:translate-x-0 sm:opacity-100'}
            sm:block
          `}
          style={{
            pointerEvents: isSidebarOpen || window.innerWidth >= 640 ? 'auto' : 'none',
            background: window.innerWidth < 640 ? 'transparent' : undefined,
          }}
        >
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            userId={userId}
            socket={socketInstance}
            setChats={setChats}
            setSelectedChatId={setSelectedChatId}
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className={`w-full sm:w-2/3 max-w-full min-w-0`}>
          <ChatWindow
            selectedChat={
              selectedChatId
                ? chats.find((c) => c._id === selectedChatId)
                : null
            }
            isGroupChat={
              selectedChatId
                ? chats.find((c) => c._id === selectedChatId)?.isGroupChat
                : false
            }
            message={message}
            socket={socketInstance}
            userId={userId}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            setChats={setChats}
            setSelectedChatId={setSelectedChatId}
          />
        </div>
      </div>
    </div>
  );
};

export default Chats;
