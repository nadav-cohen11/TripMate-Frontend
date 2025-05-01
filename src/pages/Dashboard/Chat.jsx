import React, { useEffect } from 'react';
import Navbar from '@/components/ui/NavBar';
import { useState } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const mockChats = [
  {
    id: 1,
    name: 'Alice',
    type: 'direct',
    messages: [
      { text: 'Hey there!', sender: 'Alice' },
      { text: 'Welcome to the chat!', sender: 'system' },
    ],
  },
  {
    id: 2,
    name: 'Trip Planning Group',
    type: 'group',
    messages: [
      { text: "Let's plan our trip!", sender: 'Bob' },
      { text: 'Welcome to the group!', sender: 'system' },
    ],
  },
];

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [socketInstance, setSocketInstance] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState();
  const [userId, setUserId] = useState('68120233d9050d1d2e0a64ba');

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);


  const handleSendMessage = async () => {
    if (socketInstance && message.trim()) {
      socketInstance.emit('chat message', message);
      setMessage('');
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, { text: message, sender: 'user' }],
              }
            : chat,
        ),
      );
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:3000');
    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log(`User connected with id: ${socket.id}`);
    });

    socket.emit('getChats', { userId }, (chats) => {
      console.log(chats);
      setChats(chats);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <div
        style={{
          width: 220,
          borderRight: '1px solid #ccc',
          padding: 16,
          background: '#fafafa',
        }}
      >
        <h4>Direct Chats</h4>
        {chats &&
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChatId(chat._id)}
              style={{
                padding: '8px 12px',
                marginBottom: 8,
                borderRadius: 8,
                background:
                  selectedChatId === chat._id ? '#e6f0ff' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {(chat.participants &&
                chat.participants.filter((p) => p._id !== userId)[0]
                  ?.fullName) ||
                ''}
            </div>
          ))}
        <h4 style={{ marginTop: 24 }}>Groups</h4>
      </div>
      <div style={{ flex: 1, maxWidth: 500, margin: '40px auto', padding: 16 }}>
        <div style={{ minHeight: 200, marginBottom: 16 }}>
          {/* {selectedChat.messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '8px 0',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                  padding: '8px 12px',
                  borderRadius: 16,
                }}
              >
                {msg.text}
              </span>
            </div>
          ))} */}
        </div>
        {selectedChatId && (
          <form style={{ display: 'flex' }}>
            <input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type a message...'
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 16,
                border: '1px solid #ccc',
              }}
            />
            <button
              type='button'
              onClick={handleSendMessage}
              style={{
                marginLeft: 8,
                padding: '8px 16px',
                borderRadius: 16,
                border: 'none',
                background: '#007bff',
                color: '#fff',
              }}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
