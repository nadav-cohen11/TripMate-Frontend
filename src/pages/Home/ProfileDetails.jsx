import { CalendarDays, Globe2, Sparkles, Users } from 'lucide-react';
import ReviewList from './ReviewList';

const ProfileDetails = ({ user, age, city, country, languages, travel, distance, aiSuggested, compatibilityScore }) => {
  const roundedDistance = distance ? Math.round(distance) : null;
  return (
    <div className="flex-1 overflow-y-auto bg-white/90 backdrop-blur-md rounded-3xl px-6 py-6 shadow-xl text-gray-800 space-y-6">
      {aiSuggested && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 via-sky-100 to-blue-50 text-blue-700 px-3 py-2 rounded-xl w-max shadow">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">AI-Suggested Match</span>
          {compatibilityScore && (
            <span className="ml-2 text-xs text-gray-600">Score: {compatibilityScore}%</span>
          )}
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {user.fullName}{age ? `, ${age}` : ''}
        </h1>
        <p className="text-sm text-gray-500">📍 {city}, {country}</p>
        {roundedDistance != null && (
          <p className="text-sm text-sky-600">{roundedDistance} km away</p>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-base leading-relaxed text-gray-700 italic border-l-4 border-sky-200 pl-4">
          {user.bio}
        </p>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <p><span className="font-medium text-gray-600">Gender:</span> {user.gender || 'Not specified'}</p>
        <p><span className="font-medium text-gray-600">Languages:</span> {languages}</p>
        <p><span className="font-medium text-gray-600">Adventure Style:</span> {user.adventureStyle || 'Not specified'}</p>
      </div>

      {/* Travel Details */}
      {travel?.travelDates && (
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-4 rounded-xl shadow-sm space-y-2 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <CalendarDays size={18} />
            <span>
              <span className="font-semibold">Dates:</span> {new Date(travel.travelDates.start).toLocaleDateString()} → {new Date(travel.travelDates.end).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Globe2 size={18} />
            <span>
              <span className="font-semibold">Destinations:</span> {travel.destinations?.join(', ') || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Users size={18} />
            <span>
              <span className="font-semibold">Group Size:</span> {travel.groupSize || 'N/A'}
            </span>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="pt-2">
        <ReviewList userId={user._id} />
      </div>
    </div>
  );
};

export default ProfileDetails;
