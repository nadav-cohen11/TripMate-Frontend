import { unmatchUsers, createOrAcceptMatch } from '@/api/matchApi';

const PendingMatch = ({ match }) => {
  const user = match.user1Id;
  if (!user) return null;

  const handleAccept = () => {};

  const handleDecline = () => {
    
  };

  return (
    <>
      <div
        key={match._id}
        className='bg-white/90 rounded-lg shadow-md p-4 flex flex-row items-center w-full mb-4 space-x-4'
        style={{ overflow: 'hidden' }}
      >
        <img
          src={
            Array.isArray(user.photos) && user.photos.length > 0
              ? user.photos[0].url
              : ''
          }
          alt={user.fullName}
          className='w-12 h-12 rounded-full border-2 border-blue-200 object-cover flex-shrink-0'
        />
        <div className='flex-1 flex flex-col justify-center space-y-1 min-w-0'>
          <div
            className='text-base font-semibold truncate'
            title={user.fullName}
          >
            {user.fullName}
          </div>
          <div
            className='text-gray-600 text-sm truncate'
            title={user.bio}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {user.bio}
          </div>
          <div className='text-xs text-blue-700 font-medium truncate'>
            Compatibility: {match.compatibilityScore}%
          </div>
        </div>
        <div className='flex flex-col space-y-2'>
          <button
            className='px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600'
            // onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600'
            // onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </>
  );
};

export default PendingMatch;
