import { ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoNavigation = ({ user, photoIndex, nextPhoto, prevPhoto, setPhotoIndex }) => {
  return (
    <>
      {user.photos?.length > 1 && (
        <>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-6 rounded-full cursor-pointer transition-all duration-300 ${index === photoIndex ? 'bg-white' : 'bg-white/40'}`}
                onClick={() => setPhotoIndex(index)}
              />
            ))}
          </div>
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); prevPhoto(); }}
            onTouchStart={e => { e.stopPropagation(); }}
            onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); prevPhoto(); }}
            className="pointer-events-auto absolute top-0 bottom-0 left-2 w-12 h-113 flex items-center justify-center bg-black/30 p-2 rounded-md hover:bg-black/60 opacity-0 active:opacity-80 transition-opacity z-30"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); nextPhoto(); }}
            onTouchStart={e => { e.stopPropagation(); }}
            onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); nextPhoto(); }}
            className="pointer-events-auto absolute top-0 bottom-0 right-2 w-12 h-113 flex items-center justify-center bg-black/30 p-2 rounded-md hover:bg-black/60 opacity-0 active:opacity-80 transition-opacity z-20"
            aria-label="Next Photo"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}
    </>
  );
};

export default PhotoNavigation;