import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useChatSocket = (userId, setChats) => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (userId) {
      const socket = io(import.meta.env.VITE_BACKEND_URL);
      setSocketInstance(socket);

      socket.on('connect', () => {
        console.log(`User connected with id: ${socket.id}`);
      });

      socket.emit('getChats', { userId }, (chats) => {
        setChats(chats);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userId, setChats]);

  return socketInstance;
};

export default useChatSocket;
