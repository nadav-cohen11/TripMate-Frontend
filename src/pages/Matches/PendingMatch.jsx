import { decline, createOrAcceptMatch } from '@/api/matchApi';
import { useMutation } from '@tanstack/react-query';

const PendingMatch = ({ match, acceptMutation, declineMutation }) => {
  const user = match.user1Id;
  if (!user) return null;

  const handleDecline = (matchId) => {
    const confirmation = confirm('Are you sure you want to decline?')
    if(!confirmation) return
    declineMutation.mutate(matchId);
  }

  return (
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
      <div className='flex flex-col space-y-2 gap-2.5'>
        <button
          className='px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition'
          onClick={() => acceptMutation.mutate(match._id)}
        >
          Accept
        </button>
        <button
          className='px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition border border-red-200'
          onClick={() => handleDecline(match._id)}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default PendingMatch;
