import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

const ProfileImage = ({
  photo,
  photoIndex,
  nextPhoto,
  prevPhoto,
  photoCount,
  setPhotoIndex,
}) => {
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleImageClick = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    if (x < bounds.width / 2) {
      if (photoIndex === 0) return;
      prevPhoto();
    } else {
      if (photoIndex === photoCount - 1) return; 
      nextPhoto();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && photoIndex > 0) {
        prevPhoto();
      } else if (diff < 0 && photoIndex < photoCount - 1) {
        nextPhoto(); 
      }
    } else {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = endX - bounds.left;
      if (x < bounds.width / 2) {
        if (photoIndex === 0) return;
        prevPhoto();
      } else {
        if (photoIndex === photoCount - 1) return;
        nextPhoto();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className='relative w-full h-[55%] flex items-center justify-center select-none cursor-pointer'
      onClick={handleImageClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='w-full h-full overflow-hidden bg-gray-100'>
        <AnimatePresence mode='popLayout'>
          <motion.img
            key={photoIndex}
            src={photo}
            alt={`profile-${photoIndex}`}
            className='object-cover w-full h-full'
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            draggable={false}
          />
        </AnimatePresence>
      </div>
      {photoCount > 1 && (
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10'>
          {Array.from({ length: photoCount }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
                idx === photoIndex ? 'bg-[#00BFFF]' : 'bg-gray-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex(idx);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setPhotoIndex(idx);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
