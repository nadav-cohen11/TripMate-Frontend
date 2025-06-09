import { decline, createOrAcceptMatch } from '@/api/matchApi';
import { useMutation } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

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
      className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 flex flex-row items-center w-full mb-4 space-x-4 hover:shadow-xl transition-all duration-300'
      style={{ overflow: 'hidden' }}
    >
      <div className="relative">
        <img
          src={
            Array.isArray(user.photos) && user.photos.length > 0
              ? user.photos[0].url
              : ''
          }
          alt={user.fullName}
          className='w-14 h-14 rounded-full border-2 border-blue-200 object-cover flex-shrink-0 shadow-md'
        />
        <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white"></div>
      </div>
      <div className='flex-1 flex flex-col justify-center space-y-1.5 min-w-0'>
        <div className='flex items-center gap-2'>
          <div
            className='text-base font-semibold truncate text-gray-800'
            title={user.fullName}
          >
            {user.fullName}
          </div>
          <div className='text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full font-medium'>
            Pending
          </div>
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
          className='px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-1.5'
          onClick={() => acceptMutation.mutate(match._id)}
        >
          <Check size={14} />
          Accept
        </button>
        <button
          className='px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition flex items-center gap-1.5'
          onClick={() => handleDecline(match._id)}
        >
          <X size={14} />
          Decline
        </button>
      </div>
    </div>
  );
};

export default PendingMatch;
