import React, { useEffect, useState, useContext } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useChatSocket from '@/hooks/useChatSocket';
import { AuthContext } from '@/context/AuthContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState();
  const { user } = useContext(AuthContext);
  const userId = user;
  const socketInstance = useChatSocket(userId, setChats);

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
          : chat
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">
      <div className="absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide">
        TripMate
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen pt-24 px-4 lg:px-12 gap-6">
        <div className="w-full lg:w-1/3">
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            userId={userId}
            socket={socketInstance}
            setChats={setChats}
            setSelectedChatId={setSelectedChatId}
          />
        </div>
        <div className="w-full lg:w-2/3">
          <ChatWindow
            selectedChat={
              selectedChatId ? chats.find((c) => c._id === selectedChatId) : null
            }
            isGroupChat={
              selectedChatId
                ? chats.find((c) => c._id === selectedChatId).isGroupChat
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
