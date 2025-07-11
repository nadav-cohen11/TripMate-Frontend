import React, { useEffect, useState } from 'react';
import * as utils from './utils';
import { getWeather } from '../../../api/aiApi';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const GroupDetails = ({ handleLeaveTrip, group, onBack, socket }) => {
  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const {user} = useAuth()


  useEffect(() => {
    socket.emit('getTrip', { tripId: group.tripId }, (trip) => {
      setTrip(trip);
    });
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (trip?.destination?.city && trip?.destination?.country) {
        try {
          const { data } = await getWeather(trip.destination.city, trip.destination.country);
          setWeather(data);
        } catch (error) {
        }
      }
    };

    fetchWeather();
  }, [trip]);

  function formatItineraryText(text) {
    if (!text) return '';
    const daySections = text.split(/(?=Day \d+:)/g);
    return daySections.map((section) => {
      const lines = section.trim().split('\n');
      const title = lines[0];
      let html = `<h3 style='font-size:1.2em;font-weight:bold;margin-top:1.5em;'>${title}</h3>`;
      let currentSection = '';
      let inList = false;
      lines.slice(1).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (/^(Morning|Afternoon|Evening|Midday|Pro Tip|Mission|Online Resources|Why |Want a different itinerary|Capping|Protect|Ends|Lastly|How to implement|\- )/i.test(trimmed)) {
          if (inList) { html += '</ul>'; inList = false; }
          if (/^Pro Tip/i.test(trimmed)) {
            html += `<p style='color:#7c3aed;font-weight:500;margin:0.5em 0;'>${trimmed}</p>`;
          } else if (/^\- /.test(trimmed)) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${trimmed.replace(/^\- /, '')}</li>`;
          } else {
            html += `<h4 style='font-size:1em;font-weight:600;margin-top:1em;'>${trimmed.replace(/:$/, '')}</h4>`;
          }
        } else if (/^\- /.test(trimmed)) {
          if (!inList) { html += '<ul>'; inList = true; }
          html += `<li>${trimmed.replace(/^\- /, '')}</li>`;
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<p>${trimmed}</p>`;
        }
      });
      if (inList) html += '</ul>';
      return html;
    }).join('');
  }

  function parseItineraryByDay(aiText) {
    if (!aiText) return [];
    const days = aiText.split(/(?=Day \d+:)/g).filter(Boolean);
    return days.map((daySection) => {
      const lines = daySection.trim().split('\n');
      const dayTitle = lines[0] || '';
      const items = [];
      let currentItem = { title: '', description: '', link: '' };
      lines.slice(1).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const match = trimmed.match(/^(.+?):\s*(.+?)(?:\s*\((https?:\/\/[^\s)]+)\))?$/);
        if (match) {
          if (currentItem.title) items.push(currentItem);
          currentItem = {
            title: match[1],
            description: match[2],
            link: match[3] || ''
          };
        } else {
          currentItem.description += ' ' + trimmed;
        }
      });
      if (currentItem.title) items.push(currentItem);
      return { dayTitle, items };
    });
  }

  return (
    <>
      {weather && (
        <div className='mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm'>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
            alt={weather.weather?.[0]?.description || 'weather icon'}
            className='w-12 h-12'
          />
          <div>
            <div className='text-md font-semibold text-blue-800'>
              Current Weather
            </div>
            <div className='text-gray-700'>
              {weather.weather?.[0]?.main} — {weather.main?.temp.toFixed(1)}°C
            </div>
          </div>
        </div>
      )}
      <div className='whitespace-pre-wrap text-gray-800 text-sm'>
        {trip?.ai && (
          <div className='mt-6'>
            <button
              onClick={() => setShowItinerary((prev) => !prev)}
              className='flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 font-medium rounded hover:bg-purple-200 transition-all'
            >
              <Sparkles className='w-5 h-5' />
              {showItinerary ? 'Hide AI Itinerary' : 'Show AI Itinerary'}
            </button>

            {showItinerary && (
              <div className='mt-4 space-y-6'>
                {parseItineraryByDay(trip.ai).map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className='p-4 bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm'
                  >
                    <h4 className='text-lg font-bold text-yellow-800 mb-3'>
                      {day.dayTitle}
                    </h4>
                    <ul className='space-y-4'>
                      {day.items.map((item, idx) => (
                        <li key={idx} className='border-b pb-2'>
                          <p className='font-semibold text-gray-900'>
                            {item.title}
                          </p>
                          <p className='text-gray-700 text-sm'>
                            {item.description}
                          </p>
                          {item.link && (
                            <a
                              href={item.link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 underline text-sm'
                            >
                              {item.link}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}
      </div>

      {trip && (
        <div className='flex flex-col h-[80vh] min-h-[400px] max-w-[600px] mx-auto my-10 p-6 bg-white rounded-2xl shadow-xl'>
          <button
            onClick={onBack}
            type='button'
            className='self-start mb-6 flex items-center text-blue-600 hover:text-blue-800 transition'
          >
            {utils.backIcon}
            Back to Chat
          </button>

          <h2 className='mb-8 text-3xl font-bold text-gray-800 border-b pb-3'>
            {group.chatName || 'Group Chat'}
          </h2>

          <div className='space-y-6 text-gray-700'>
            <div className='flex justify-between'>
              <span className='font-semibold'>Destination:</span>
              <span className='font-medium'>
                {trip.destination?.city}, {trip.destination?.country}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='font-semibold'>Host:</span>
              <span className='font-medium'>{trip.host?.fullName}</span>
            </div>

            <div className='flex flex-col'>
              <span className='font-semibold mb-1'>Travel Dates:</span>
              <span className='ml-4 text-gray-600'>
                Start Date:{' '}
                {trip.travelDates?.start &&
                  new Date(trip.travelDates.start).toLocaleDateString()}
              </span>
              <span className='ml-4 text-gray-600'>
                End Date:{' '}
                {trip.travelDates?.end &&
                  new Date(trip.travelDates.end).toLocaleDateString()}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='font-semibold'>Group Size:</span>
              <span className='font-medium'>{trip.participants.length}</span>
            </div>

            <div>
              <span className='font-semibold mb-2 block'>Participants:</span>
              <ul className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {trip.participants
                  ?.filter((p) => p.isConfirmed)
                  .map((p, idx) => (
                    <li
                      key={idx}
                      className='flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition'
                    >
                      <div className='flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold'>
                        {p.userId?.fullName?.charAt(0) || '?'}
                      </div>
                      <span className='ml-3 text-gray-800'>
                        {p.userId?._id === user
                          ? `${p.userId?.fullName} (You)` || p.userId?.email || 'Unknown'
                          : p.userId?.fullName || p.userId?.email || 'Unknown'}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className='mt-6'>
              <button
                type='button'
                onClick={handleLeaveTrip}
                className='flex items-center px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition'
              >
                {utils.leaveIcon}
                Leave Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetails;