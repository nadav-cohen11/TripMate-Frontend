import { Globe2, CalendarDays, Users, Sparkles } from 'lucide-react';
import ReviewList from './ReviewList';

const ProfileDetails = ({ user, birthDate, city, country, travel, distance, compatibilityScore }) => {
  const roundedDistance = distance ? Math.round(distance) : null;
  const age = birthDate
    ? Math.floor((new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

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
        <p>
          <span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span>
          <span className="text-base text-[#7ec3ee] font-bold tracking-wide align-middle">Languages:</span>
          <span className="font-normal text-gray-700">
            {Array.isArray(user.languages) && user.languages.length > 0
              ? user.languages.join(', ')
              : 'Not specified'}
          </span>
        </p>
        <p><span className="inline-block w-1 h-5 bg-[#7ec3ee] rounded mr-2 align-middle"></span><span className="text-base text-[#7ec3ee] font-bold tracking-wide align-middle">Adventure Style:</span> <span className="font-normal text-gray-700">{user.adventureStyle || 'Not specified'}</span></p>
      </div>
      {travel?.travelDates && (
        <div className="bg-gradient-to-br from-[#eaf4fd] via-[#eaf4fd] to-[#eaf4fd] p-4 rounded-xl shadow-sm space-y-2 text-sm">
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <CalendarDays size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Dates:</span> {new Date(travel.travelDates.start).toLocaleDateString()} → {new Date(travel.travelDates.end).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <Globe2 size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Destinations:</span> {travel.destinations?.join(', ') || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4a90e2]">
            <Users size={18} />
            <span>
              <span className="font-semibold text-[#4a90e2]">Group Size:</span> {travel.groupSize || 'N/A'}
            </span>
          </div>
        </div>
      )}
      <div className="pt-2">
      <ReviewList reviews={user.reviews} />
      </div>
    </div>
  );
};

export default ProfileDetails;
