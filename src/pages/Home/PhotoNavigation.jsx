import { ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoNavigation = ({
  user,
  photoIndex,
  nextPhoto,
  prevPhoto,
  setPhotoIndex,
}) => {
  return (
    <>
      {user.photos?.length > 1 && (
        <>
          <div className='absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10'>
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full cursor-pointer transition-all duration-300 border-2 ${
                  index === photoIndex
                    ? 'bg-[#00BFFF] border-[#00BFFF]'
                    : 'bg-[#e6f7ff] border-[#e6f7ff]'
                }`}
                onClick={() => setPhotoIndex(index)}
              />
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              prevPhoto();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              prevPhoto();
            }}
            className='pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white border-2 border-[#00BFFF] shadow-lg rounded-full hover:bg-[#e6f7ff] transition z-30'
            aria-label='Previous Photo'
          >
            <ChevronLeft className='h-7 w-7 text-[#00BFFF]' />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              nextPhoto();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              nextPhoto();
            }}
            className='pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white border-2 border-[#00BFFF] shadow-lg rounded-full hover:bg-[#e6f7ff] transition z-20'
            aria-label='Next Photo'
          >
            <ChevronRight className='h-7 w-7 text-[#00BFFF]' />
          </button>
        </>
      )}
    </>
  );
};

export default PhotoNavigation;
