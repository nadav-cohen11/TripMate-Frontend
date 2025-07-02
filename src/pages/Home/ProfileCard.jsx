import { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';
import SwipeStatus from './SwipeStatus';

const ProfileCard = ({ user, swipeInfo, onSwipe }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const nextPhoto = () =>
    setPhotoIndex((prev) => (prev + 1) % (user.photos?.length || 1));
  const prevPhoto = () =>
    setPhotoIndex(
      (prev) =>
        (prev - 1 + (user.photos?.length || 1)) % (user.photos?.length || 1),
    );
  const travel = user.travelPreferences || {};
  const country = user.location?.country || '';
  const city = user.location?.city || '';
  const photo =
    user.photos?.[photoIndex]?.url || '/assets/images/Annonymos_picture.jpg';

  const preventDrag = (e) => {
    e.stopPropagation();
  };

  const bind = useDrag(
    ({
      down,
      movement: [mx],
      velocity: [vx],
      direction: [dx],
      offset: [ox],
    }) => {
      if (!down) {
        const swipeThreshold = window.innerWidth * 0.3;
        const velocityThreshold = 0.5; 
        if (Math.abs(mx) > swipeThreshold || Math.abs(vx) > velocityThreshold) {
          const direction = dx > 0 ? 'right' : 'left';
          setPosition({
            x: dx > 0 ? window.innerWidth : -window.innerWidth,
            y: 0,
          });
          setOpacity(0);
          setTimeout(() => {
            onSwipe(direction, user._id);
            setPosition({ x: 0, y: 0 });
            setRotation(0);
            setOpacity(1);
          }, 300); 
        } else {
      
          setPosition({ x: 0, y: 0 });
          setRotation(0);
          setOpacity(1);
        }
      } else {
        setPosition({ x: mx, y: 0 });
        setRotation(mx / 10);
        setOpacity(Math.max(1 - Math.abs(mx) / window.innerWidth, 0.3)); 
      }
    },
    {
      axis: 'x', 
      bounds: { top: 0, bottom: 0 }, 
      filterTaps: true, 
    },
  );

  return (
    <div
      {...bind()}
      className='relative flex flex-col bg-white shadow-lg text-black rounded-2xl overflow-hidden w-[90vw] max-w-md h-[75vh] mx-auto my-8 border border-gray-200 p-0 transition-all duration-300'
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        opacity,
        touchAction: 'pan-y',
      }}
    >
      <SwipeStatus swipeInfo={swipeInfo} userId={user._id} />
      <ProfileImage
        photo={photo}
        photoIndex={photoIndex}
        nextPhoto={nextPhoto}
        prevPhoto={prevPhoto}
        photoCount={user.photos?.length || 1}
        setPhotoIndex={setPhotoIndex}
      />
      <div
        className='flex-1 overflow-y-auto no-drag'
        onTouchStart={preventDrag}
        onMouseDown={preventDrag}
      >
        <ProfileDetails
          user={user}
          birthDate={user.birthDate}
          country={country}
          city={city}
          travel={travel}
          distance={user.distance}
          compatibilityScore={user.compatibilityScore}
          aiSuggested={user.aiSuggested}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
