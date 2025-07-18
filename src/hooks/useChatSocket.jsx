import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useChatSocket = (userId, setChats = undefined) => {
  const [socketInstance, setSocketInstance] = useState(null);
  useEffect(() => {
    if (userId) {
      const socket = io(
        import.meta.env.VITE_DEPLOY === 'true'
          ? import.meta.env.VITE_FRONTEND_URL
          : import.meta.env.VITE_BACKEND_URL,
        {
          transports: ['websocket', 'polling'],
          withCredentials: true,
        }
      );
      setSocketInstance(socket);

      socket.on('connect', () => {
        console.log(`User connected with id: ${socket.id}`);
      });

      socket.emit('setup', userId);

      if (typeof setChats === 'function') {
        socket.emit('getChats', { userId }, (chats) => {
          setChats(chats);
        });
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [userId, setChats]);

  return socketInstance;
};

export default useChatSocket;
