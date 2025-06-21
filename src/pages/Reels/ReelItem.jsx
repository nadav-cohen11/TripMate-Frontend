import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

const ReelItem = ({ reel, children }) => {
  const navigate = useNavigate();

  const getTimeElapsed = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const uploaded = new Date(timestamp);
    const diffInSeconds = Math.floor((now - uploaded) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className='w-full h-full relative flex items-center justify-center overflow-hidden'>
      {reel.type === 'video' ? (
        <video
          src={reel.url}
          autoPlay
          loop
          muted
          playsInline
          className='h-full w-full object-contain'
        />
      ) : (
        <img
          src={reel.url}
          alt='reel'
          className='h-full w-full object-contain'
        />
      )}
      <div className='absolute top-4 left-4 z-10 flex items-center bg-white/70 backdrop-blur px-3 py-1.5 rounded-full shadow-md border border-[#4a90e2]/10 space-x-2'>
        <div className='flex items-center gap-2'>
          {reel.userProfilePhotoUrl ? (
            <img
              src={reel.userProfilePhotoUrl}
              alt='Profile'
              className='w-8 h-8 rounded-full object-cover border border-[#4a90e2]/20'
            />
          ) : (
            <div className='w-8 h-8 rounded-full bg-gray-300 border border-[#4a90e2]/20' />
          )}
          <a
            href={`/profile/${reel.userId}`}
            className='text-[#4a90e2] font-semibold text-sm hover:underline truncate max-w-[8rem]'
          >
            {reel.userFullName}
          </a>
          <span className='text-gray-600 text-xs font-medium'>
            {getTimeElapsed(reel.createdAt)} ago
          </span>
        </div>
      </div>
      <div className='absolute top-4 right-4 z-10 flex items-center'>
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#4a90e2]/30 shadow-md hover:bg-[#4a90e2]/10 text-[#4a90e2] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a90e2]/30'
          title='Create New Reel'
          onClick={() => navigate('/photos')}
        >
          <Camera className='w-5 h-5' />
        </button>
      </div>
      {children}
    </div>
  );
};

export default memo(ReelItem);
