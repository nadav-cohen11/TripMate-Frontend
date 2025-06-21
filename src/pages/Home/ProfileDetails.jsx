import { Globe2, CalendarDays, Sparkles, User, Star } from 'lucide-react';
import TravelPreferencesModal from '../Auth/TravelPreferencesModal';
import { IoPencil } from 'react-icons/io5';
import ReviewList from './ReviewList';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { FaSuitcase } from 'react-icons/fa';

const ProfileDetails = ({
  user,
  birthDate,
  city,
  country,
  travel,
  distance,
  compatibilityScore,
}) => {
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const { userId } = useParams();
  const { user: currUser } = useAuth();

  const roundedDistance = distance ? Math.round(distance) : null;
  const age = birthDate
    ? Math.floor(
        (new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25),
      )
    : null;

  return (
    <div className='flex-1 overflow-y-auto bg-transparent rounded-2xl px-6 py-4 shadow-none text-black space-y-6'>
      {compatibilityScore && (
        <div className='flex items-center gap-2 bg-gray-100 text-[#00BFFF] px-3 py-2 rounded-xl w-max shadow font-semibold'>
          <Sparkles className='w-4 h-4 text-[#00BFFF]' />
          <span className='text-sm font-medium'>AI-Suggested Match</span>
          <span className='ml-2 text-xs opacity-70'>
            Score: {compatibilityScore}%
          </span>
        </div>
      )}

      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight text-black'>
          {user.fullName}
          {age ? `, ${age}` : ''}
        </h1>
        <p className='text-sm text-gray-500'>
          📍 {city}, {country}
        </p>
        {roundedDistance != null && (
          <p className='text-xs text-gray-400'>{roundedDistance} km away</p>
        )}
      </div>

      {user.bio && (
        <div className='flex items-center border-l-4 border-gray-200 pl-3 py-2 bg-gray-50 rounded-lg'>
          <span className='italic text-black/80 text-base leading-relaxed'>
            {user.bio}
          </span>
        </div>
      )}
      <div className='flex flex-col gap-2 border-t border-gray-100 pt-4'>
        <p>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Gender:
          </span>{' '}
          <span className='font-normal text-gray-700'>
            {user.gender || 'Not specified'}
          </span>
        </p>
        <p>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Languages:
          </span>{' '}
          <span className='font-normal text-gray-700'>
            {Array.isArray(user.languages) && user.languages.length > 0
              ? user.languages.join(', ')
              : 'Not specified'}
          </span>
        </p>
        <p>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Adventure Style:
          </span>{' '}
          <span className='font-normal text-gray-700'>
            {user.adventureStyle || 'Not specified'}
          </span>
        </p>
      </div>
      {travel && (
        <div className='relative bg-gray-50 p-4 rounded-xl shadow-sm space-y-2 text-sm mt-4 border border-gray-100'>
          {userId === currUser && (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className='absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100 transition duration-150 z-10 border border-gray-200'
            >
              <IoPencil className='text-gray-400 text-lg' />
            </button>
          )}
          <div className='font-semibold text-gray-700 mb-2 text-base flex items-center gap-2'>
            <FaSuitcase size={16} /> Travel Preferences
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <CalendarDays size={16} />
            <span>
              <span className='font-semibold'>Dates:</span>{' '}
              {travel.travelDates?.start
                ? new Date(travel.travelDates.start).toLocaleDateString()
                : 'N/A'}{' '}
              →{' '}
              {travel.travelDates?.end
                ? new Date(travel.travelDates.end).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Globe2 size={16} />
            <span>
              <span className='font-semibold'>Destinations:</span>{' '}
              {travel.destinations?.length
                ? travel.destinations.join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <User size={16} />
            <span>
              <span className='font-semibold'>Group Size:</span>{' '}
              {travel.groupSize || 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <User size={16} />
            <span>
              <span className='font-semibold'>Age Range:</span>{' '}
              {travel.ageRange?.min ?? 'N/A'} – {travel.ageRange?.max ?? 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Star size={16} />
            <span>
              <span className='font-semibold'>Interests:</span>{' '}
              {travel.interests?.length ? travel.interests.join(', ') : 'N/A'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <FaSuitcase size={16} />
            <span>
              <span className='font-semibold'>Travel Style:</span>{' '}
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
      <div className='pt-4 border-t border-gray-100'>
        <ReviewList reviews={user.reviews} />
      </div>
    </div>
  );
};

export default ProfileDetails;
