import { Globe2, CalendarDays, Users } from 'lucide-react';
import ReviewList from './ReviewList'

const ProfileDetails = ({ user, age, city, country, languages, travel, distance }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-4 space-y-3 text-gray-800">
      <h1 className="text-2xl font-semibold">{user.fullName}{age ? `, ${age}` : ''}</h1>
      <p className="text-sm text-gray-500">📍 {country} , {city}</p>
      {distance != null && (
        <p className="text-sm text-gray-600 mt-1">{distance} km away</p>
      )}
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
      <ReviewList userId={user._id} />
    </div>

  );
};

export default ProfileDetails;
