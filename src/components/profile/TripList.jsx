import React from 'react';

const TripList = ({ trips }) => {
  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="font-semibold">{trip.destination}</h3>
          <p className="text-gray-600">
            {trip.date} • {trip.duration}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TripList; 