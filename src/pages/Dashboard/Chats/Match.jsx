import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
const Match = ({
  userId,
  match,
  socket,
  setChats,
  buttonContent,
  addFriendToTrip,
  removeFriendFromTrip,
}) => {
  const [secondMatch, setSecondMatch] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSecondMatch(() => {
      if (match.user1Id._id === userId) {
        return match.user2Id;
      }
      return match.user1Id;
    });
  }, []);

  const handleAddFriend = () => {
    if (!secondMatch) return;
    socket.emit('addNewChat', { user1Id: userId, user2Id: secondMatch._id });
  };

  return (
    <>
      {secondMatch && (
        <div className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition'>
          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600 overflow-hidden'>
            {secondMatch.photos.length > 0 ? (
              <img
                src={secondMatch.photos[0].url}
                className='rounded-full w-10 h-10 object-cover'
                alt={secondMatch.fullName}
              />
            ) : (
              secondMatch.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            )}
          </div>
          <div className='flex-1'>
            <p className='font-medium text-gray-900'>{secondMatch.fullName}</p>
            <p className='text-xs text-gray-500'>{secondMatch.email}</p>
          </div>
          {buttonContent === 'Chat' ? (
            <Button
              type='button'
              size='sm'
              variant='secondary'
              onClick={handleAddFriend}
            >
              {buttonContent}
            </Button>
          ) : added ? (
            <Button
              type='button'
              size='sm'
              variant='secondary'
              onClick={() => {
                setAdded(false);
                removeFriendFromTrip(secondMatch);
              }}
            >
              {'Remove'}
            </Button>
          ) : (
            <Button
              type='button'
              size='sm'
              variant='secondary'
              onClick={() => {
                setAdded(true);
                addFriendToTrip(secondMatch);
              }}
            >
              {buttonContent}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Match;
