import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Globe2, CalendarDays, Users } from 'lucide-react';
import { useEffect } from 'react';
import { getLocationName } from '../utils/geocodeUtils';

const ProfileCard = ({ user, age, swipeInfo }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [locationName, setLocationName] = useState('');

  const nextPhoto = () => setPhotoIndex((prev) => (prev + 1) % (user.photos.length || 1));
  const prevPhoto = () => setPhotoIndex((prev) => (prev - 1 + (user.photos.length || 1)) % (user.photos.length || 1));

  const travel = user.travelPreferences || {};
  const languages = user.languagesSpoken.join(', ') || 'Not specified';
  const coordinates = user.location?.coordinates;
  const photo = user.photos[photoIndex] || '/assets/images/Annonymos_picture.jpg';

  useEffect(() => {
    const fetchLocation = async () => {
      if (coordinates?.length === 2) {
        const name = await getLocationName(coordinates[1], coordinates[0]);
        setLocationName(name);
      }
    };
    fetchLocation();
  }, [coordinates]);

  return (
    <div className="flex flex-col bg-white text-gray-900 rounded-lg overflow-hidden w-[90vw] h-[80vh] mx-auto my-6 relative border border-gray-200">
      {swipeInfo.id === user._id && swipeInfo.direction && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute top-8 left-8 text-4xl font-bold ${
            swipeInfo.direction === 'left' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {swipeInfo.direction === 'left' ? 'NOPE' : 'LIKE'}
        </motion.div>
      )}

      <div className="relative w-full h-[60%]">
        <AnimatePresence mode="wait">
          <motion.img
            key={photoIndex}
            src={photo}
            alt={`profile-${photoIndex}`}
            className="object-cover w-full h-full rounded-t-lg"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {user.photos.length > 1 && (
          <>
            <button onClick={prevPhoto} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/60">
              <ChevronLeft className="text-white" />
            </button>
            <button onClick={nextPhoto} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/60">
              <ChevronRight className="text-white" />
            </button>
          </>
        )}

        {user.aiSuggested && (
          <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 text-xs rounded-full flex items-center space-x-1">
            <Sparkles size={16} />
            <span>AI Match</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-6 py-4 space-y-3 text-gray-800">
        <h1 className="text-2xl font-semibold">{user.fullName}{age ? `, ${age}` : ''}</h1>
        <p className="text-sm text-gray-500">{coordinates ? `📍 ${locationName}` : ''}</p>
        <p className="text-md">{user.bio}</p>

        <div className="space-y-1 text-sm">
          <p><strong>Gender:</strong> {user.gender || 'Not specified'}</p>
          <p><strong>Languages:</strong> {languages}</p>
          <p><strong>Adventure Style:</strong> {user.adventureStyle || 'Not specified'}</p>
        </div>

        {travel.travelDates && (
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center gap-2 text-indigo-400">
              <CalendarDays size={16} />
              <span><strong>Dates:</strong> {new Date(travel.travelDates.start).toLocaleDateString()} → {new Date(travel.travelDates.end).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 size={16} />
              <span><strong>Destinations:</strong> {travel.destinations.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span><strong>Group Size:</strong> {travel.groupSize}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
