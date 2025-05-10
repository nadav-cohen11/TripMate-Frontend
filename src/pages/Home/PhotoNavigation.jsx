import { ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoNavigation = ({ user, photoIndex, nextPhoto, prevPhoto, setPhotoIndex }) => {
    return (
      <>
        {user.photos.length > 1 && (
          <>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {user.photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-30 rounded-full transition-all duration-300 ${index === photoIndex ? 'bg-white' : 'bg-white/40'}`}
                  onClick={() => setPhotoIndex(index)}
                />
              ))}
            </div>
            <button
              onClick={prevPhoto}
              className="absolute top-0 left-0 h-113 transform bg-black/30 p-2 rounded-full hover:bg-black/60 opacity-0"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="absolute top-0 left-0 h-full w-40 transform bg-black/30 p-2 rounded-full hover:bg-black/60 opacity-0" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute top-0 right-0 h-113 transform bg-black/30 p-2 rounded-full hover:bg-black/60 opacity-0"
              aria-label="Next Photo"
            >
              <ChevronRight className="absolute top-0 right-0 h-full w-40 transform bg-black/30 p-2 rounded-full hover:bg-black/60 opacity-0" />
            </button>
          </>
        )}
      </>
    );
  };
  
  export default PhotoNavigation;
  