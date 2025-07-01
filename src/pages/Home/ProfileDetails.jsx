import { Globe2, CalendarDays, Sparkles, User, Star, Instagram, Facebook } from 'lucide-react';
import TravelPreferencesModal from '../Auth/TravelPreferencesModal';
import { IoPencil } from 'react-icons/io5';
import ReviewList from './ReviewList';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const { userId } = useParams();
  const { user: currUser } = useAuth();

  const roundedDistance = distance ? Math.round(distance) : null;
  const age = birthDate
    ? Math.floor(
        (new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25),
      )
    : null;

  const hasMissingTravelData = (travelData) => {
    if (!travelData) return true;
    
    const checks = [
      !travelData.travelDates?.start || !travelData.travelDates?.end,
      !travelData.destinations?.length,
      !travelData.groupSize,
      !travelData.ageRange?.min || !travelData.ageRange?.max,
      !travelData.interests?.length,
      !travelData.travelStyle
    ];
    
    return checks.some(check => check);
  };

  useEffect(() => {
    if (userId === currUser && travel && hasMissingTravelData(travel)) {
      setShowUpdatePrompt(true);
    }
  }, [userId, currUser, travel]);

  return (
    <div className='flex-1 overflow-y-auto bg-transparent rounded-2xl px-6 py-4 shadow-none text-black space-y-6'>
      <div className='flex items-center justify-between space-y-0 mb-1'>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-bold tracking-tight text-black'>
            {user.fullName}
            {age ? `, ${age}` : ''}
          </h1>
        </div>
        {compatibilityScore && (
          <div className="flex items-center gap-2 bg-gray-100 text-[#00BFFF] px-3 py-1 rounded-xl shadow font-semibold">
            <Sparkles className="w-4 h-4 text-[#00BFFF]" />
            <span className="text-sm font-medium">AI Match {compatibilityScore}%</span>
          </div>
        )}
      </div>

      <div className='space-y-1'>
        <p className='text-sm text-gray-500'>
          📍 {city}, {country}
        </p>
        {roundedDistance != null && (
          <p className='text-xs text-gray-400'>{roundedDistance} km away</p>
        )}
      </div>
      

      {(user.socialLinks?.instagram || user.socialLinks?.facebook) && (
        <div className='flex gap-4 mt-4'>
          {user.socialLinks?.instagram && (
            <a
              href={user.socialLinks.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'
            >
              <Instagram size={18} />
              Instagram
            </a>
          )}
          {user.socialLinks?.facebook && (
            <a
              href={user.socialLinks.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'
            >
              <Facebook size={18} />
              Facebook
            </a>
          )}
        </div>
      )}

      {user.bio && (
        <div className='flex items-center border-l-4 border-gray-200 pl-3 py-2 bg-gray-50 rounded-lg mt-4'>
          <span className='italic text-black/80 text-base leading-relaxed'>
            {user.bio}
          </span>
        </div>
      )}

      <div className='flex flex-col gap-2 border-t border-gray-100 pt-4'>
        <p className='flex gap-1 items-center'>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Gender:
          </span>{' '}
          <span className='font-normal text-gray-700 capitalize'>
            {user.gender || 'Not specified'}
          </span>
        </p>
        <p className='flex gap-1 items-center'>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Languages:
          </span>{' '}
          <span className='font-normal text-gray-700 capitalize'>
            {Array.isArray(user.languages) && user.languages.length > 0
              ? user.languages.join(', ')
              : 'Not specified'}
          </span>
        </p>
        <p className='flex gap-1 items-center'>
          <span className='text-base font-semibold text-gray-700 align-middle'>
            Adventure Style:
          </span>{' '}
          <span className='font-normal text-gray-700 capitalize'>
            {user.adventureStyle || 'Not specified'}
          </span>
        </p>
      </div>

      {travel && (
        <div className='relative bg-gray-50 p-4 rounded-xl shadow-sm space-y-3 text-sm mt-6 border border-gray-100'>
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

      <div className='pt-4 border-t border-gray-100 mt-6'>
        <ReviewList reviews={user.reviews} />
      </div>

      <Transition appear show={showUpdatePrompt} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowUpdatePrompt(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <FaSuitcase className="w-8 h-8 text-blue-500" />
                    </div>
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Complete Your Travel Profile
                    </Dialog.Title>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-4">
                      We noticed some of your travel preferences are incomplete. 
                      Adding more details will help you find better travel matches!
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-700 font-medium mb-2">Missing information:</p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        {(!travel?.travelDates?.start || !travel?.travelDates?.end) && (
                          <li>• Travel dates</li>
                        )}
                        {!travel?.destinations?.length && (
                          <li>• Destinations</li>
                        )}
                        {!travel?.groupSize && (
                          <li>• Group size</li>
                        )}
                        {(!travel?.ageRange?.min || !travel?.ageRange?.max) && (
                          <li>• Age range</li>
                        )}
                        {!travel?.interests?.length && (
                          <li>• Interests</li>
                        )}
                        {!travel?.travelStyle && (
                          <li>• Travel style</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                      onClick={() => {
                        setShowUpdatePrompt(false);
                        setIsEditingPreferences(true);
                      }}
                    >
                      Update Now
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                      onClick={() => setShowUpdatePrompt(false)}
                    >
                      Maybe Later
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProfileDetails;
