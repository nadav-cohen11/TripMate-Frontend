import { useState } from 'react';
import PhotoNavigation from './PhotoNavigation';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';
import SwipeStatus from './SwipeStatus';

const ProfileCard = ({ user, age, swipeInfo }) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextPhoto = () => setPhotoIndex((prev) => (prev + 1) % (user.photos.length || 1));
  const prevPhoto = () => setPhotoIndex((prev) => (prev - 1 + (user.photos.length || 1)) % (user.photos.length || 1));

  const travel = user.travelPreferences || {};
  const languages = user.languagesSpoken.join(', ');
  const country = user.location.country;
  const city = user.location.city;
  const photo = user.photos?.[photoIndex] || '/assets/images/Annonymos_picture.jpg';

  return (
    <div className="relative flex flex-col bg-white/90 shadow-xl backdrop-blur-sm text-gray-900 rounded-3xl overflow-hidden w-[90vw] max-w-md h-[80vh] mx-auto my-4 border border-blue-100">
      <SwipeStatus swipeInfo={swipeInfo} userId={user._id} />
      <ProfileImage photo={photo} photoIndex={photoIndex} />
      <PhotoNavigation
        user={user}
        photoIndex={photoIndex}
        nextPhoto={nextPhoto}
        prevPhoto={prevPhoto}
        setPhotoIndex={setPhotoIndex}
      />
      <ProfileDetails
        user={user}
        age={age}
        country={country}
        city={city}
        languages={languages}
        travel={travel}
        distance={user.distance}
        compatibilityScore={user.compatibilityScore}
        aiSuggested={user.aiSuggested}
      />  
    </div>
  );
};

export default ProfileCard;
