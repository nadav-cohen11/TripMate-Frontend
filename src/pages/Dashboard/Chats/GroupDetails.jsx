import React, { useEffect, useState } from 'react';
import * as utils from './utils';


const GroupDetails = ({ handleLeaveTrip, group, onBack, socket }) => {
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    socket.emit('getTrip', { tripId: group.tripId }, (trip) => {
      setTrip(trip);
    });

  }, []);

  return (
    <>
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
                        {p.userId?.fullName || p.userId?.email || 'Unknown'}
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
