import React, { useEffect } from 'react';
import Navbar from '@/components/ui/NavBar';
import { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useChatSocket from '@/hooks/useChatSocket';
import { useGlobalContext } from '@/context/GlobalContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState();
  const { userId } = useGlobalContext();
  const socketInstance = useChatSocket(userId, setChats);

  useEffect(() => {
    if (chats.length > 0) {
      const directChat = chats.find((chat) => !chat.isGroupChat);
      if (directChat) {
        setSelectedChatId(directChat._id);
      } else {
        setSelectedChatId(chats[0]._id);
      }
    }
  }, []);

  useEffect(() => {
    if (socketInstance && selectedChatId) {
      socketInstance.emit('joinRoom', { chatId: selectedChatId });
    }
  }, [selectedChatId, socketInstance]);

  useEffect(() => {
    if (socketInstance)
      socketInstance.on('messageReceived', handleMessageReceived);
  }, [socketInstance]);

 
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (socketInstance && message.trim() && selectedChatId) {
      const msg = {
        content: message,
        sentAt: new Date(),
      };
      socketInstance.emit('sendMessage', {
        room: selectedChatId,
        sender: userId,
        msg,
      });
      setMessage('');
    }
  };

  const handleSelectedChatId = (id) => {
    setSelectedChatId(id);
  };

  const handleMessageReceived = (msg) => {
    setChats((prev) => {
      return prev.map((chat) => {
        if (String(chat._id) === String(msg.chatId)) {
          return {
            ...chat,
            messages: [...(chat.messages || []), msg],
            lastMessagePreview: msg.content,
          };
        }
        return chat;
      });
    });
  };

  return (
    <div className='flex min-h-full'>
      <Navbar />
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        userId={userId}
        socket={socketInstance}
        setChats={setChats}
        handleSelectedChatId={handleSelectedChatId}
      />

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
  );
};

export default Chats;
