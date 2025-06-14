import { Globe2, CalendarDays, Users, Sparkles, User, Star } from 'lucide-react';
import TravelPreferencesModal from '../Auth/TravelPreferencesModal';
import { IoPencil } from 'react-icons/io5';
import ReviewList from './ReviewList';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { FaSuitcase } from 'react-icons/fa';

const ProfileDetails = ({ user, age, city, country, languages, travel, distance, compatibilityScore }) => {
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const { userId } = useParams();
  const { user: currUser } = useAuth();

  const roundedDistance = distance ? Math.round(distance) : null;
  return (
    <div className="flex-1 overflow-y-auto bg-white/90 backdrop-blur-md rounded-3xl px-6 py-6 shadow-xl text-gray-800 space-y-6">
      {
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#eaf4fd] via-[#eaf4fd] to-[#eaf4fd] text-[#4a90e2] px-3 py-2 rounded-xl w-max shadow">
          <Sparkles className="w-4 h-4 text-[#4a90e2]" />
          <span className="text-sm font-medium text-[#4a90e2]">AI-Suggested Match</span>
          {compatibilityScore && (
            <span className="ml-2 text-xs text-[#4a90e2] opacity-70">Score: {compatibilityScore}%</span>
          )}
        </div>
      }

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#7ec3ee]">
          {user.fullName}{age ? `, ${age}` : ''}
        </h1>
        <p className="text-sm text-gray-500">📍 {city}, {country}</p>
        {roundedDistance != null && (
          <p className="text-sm text-[#7ec3ee]">{roundedDistance} km away</p>
        )}
      </div>

      {user.bio && (
        <div className="flex items-center">
          <span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span>
          <span className="border-l-0 pl-0 italic text-gray-700 text-base leading-relaxed">{user.bio}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <p><span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span><span className="text-base text-[#7ec3ee] font-bold tracking-wide align-middle">Gender:</span> <span className="font-normal text-gray-700">{user.gender || 'Not specified'}</span></p>
        <p><span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span><span className="text-base text-[#7ec3ee] font-bold tracking-wide align-middle">Languages:</span> <span className="font-normal text-gray-700">{languages}</span></p>
        <p><span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span><span className="text-base text-[#7ec3ee] font-bold tracking-wide align-middle">Adventure Style:</span> <span className="font-normal text-gray-700">{user.adventureStyle || 'Not specified'}</span></p>
      </div>
      {travel && (
        <div className="relative bg-gradient-to-br from-[#eaf4fd] via-[#eaf4fd] to-[#eaf4fd] p-4 rounded-xl shadow-sm space-y-2 text-sm">
          {userId === currUser && (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100 transition duration-150 z-10"
            >
              <IoPencil className="text-black-600 text-lg" />
            </button>
          )}

          {/* Travel Dates */}
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <CalendarDays size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Dates:</span>{' '}
              {travel.travelDates?.start
                ? new Date(travel.travelDates.start).toLocaleDateString()
                : 'N/A'}{' '}
              →{' '}
              {travel.travelDates?.end
                ? new Date(travel.travelDates.end).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <Globe2 size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Destinations:</span>{' '}
              {travel.destinations?.length
                ? travel.destinations.join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <User size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Group Size:</span>{' '}
              {travel.groupSize || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <User size={18} /> 
            <span>
              <span className="font-semibold text-[#4a90e2]">Age Range:</span>{' '}
              {travel.ageRange?.min ?? 'N/A'} – {travel.ageRange?.max ?? 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <Star size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Interests:</span>{' '}
              {travel.interests?.length
                ? travel.interests.join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <FaSuitcase size={18} /> {/* or any icon representing style */}
            <span>
              <span className="font-semibold text-[#4a90e2]">Travel Style:</span>{' '}
              {travel.travelStyle || 'N/A'}
            </span>
          </div>
          <TravelPreferencesModal
            isOpen={isEditingPreferences}
            onClose={() => setIsEditingPreferences(false)}
            userId={user?._id}
            currentPreferences={travel}
          />
        </div>
      )}
      <div className="pt-2">
        <ReviewList reviews={user.reviews} />
      </div>
    </div>
  );
};

export default ProfileDetails;
