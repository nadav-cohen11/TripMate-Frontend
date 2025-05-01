import React, { useEffect } from 'react';
import Navbar from '@/components/ui/NavBar';
import { useState } from 'react';
import io from 'socket.io-client';

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
  const [receiverId, setReceiverId] = useState();

  const handleSelectedChatId = (id) => {
    const chat = chats.find((chat) => chat._id === id);
    setSelectedChatId(id);
    const reciever =
      chat.participants.filter((p) => p._id !== userId)[0]?._id || '';
    setReceiverId(reciever);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (socketInstance && message.trim() && selectedChatId) {
      const msg = {
        sender: userId,
        receiver: receiverId,
        content: message,
        sentAt: new Date(),
      };
      socketInstance.emit('sendMessage', { chatId: selectedChatId, msg });

      setMessage('');
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:3000');
    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log(`User connected with id: ${socket.id}`);
    });

    if (selectedChatId) {
      socket.emit('joinChat', { chatId: selectedChatId });
    }

    socket.on('messageReceived', (msg) => {
      setChats((prev) => {
        return prev.map((chat) => {
          if (chat._id === selectedChatId) {
            return {
              ...chat,
              messages: [...chat.messages, msg],
            };
          }
          return chat;
        });
      });
    });

    socket.emit('getChats', { userId }, (chats) => {
      console.log(chats);
      setChats(chats);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatId]);

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
              onClick={() => handleSelectedChatId(chat._id)}
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
      <div
        style={{
          flex: 1,
          maxWidth: 500,
          margin: '40px auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          minHeight: 400,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            marginBottom: 16,
            overflowY: 'auto',
          }}
        >
          {selectedChatId && chats&&
            chats.find(c => c._id === selectedChatId).messages.map((msg, idx) => {
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
                  style={{
                    textAlign: msg.sender === userId ? 'right' : 'left',
                    margin: '8px 0',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      background: msg.sender === userId ? '#DCF8C6' : '#F1F0F0',
                      padding: '8px 12px',
                      borderRadius: 16,
                      position: 'relative',
                      minWidth: 40,
                    }}
                  >
                    {msg.content}
                    {time && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#888',
                          marginTop: 4,
                          textAlign: 'right',
                        }}
                      >
                        {time}
                      </div>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
        {selectedChatId && (
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              marginTop: 'auto',
              paddingTop: 8,
              borderTop: '1px solid #eee',
              background: '#fff',
            }}
          >
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
              type='submit'
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
