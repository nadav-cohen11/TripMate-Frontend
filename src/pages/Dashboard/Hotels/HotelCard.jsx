import React from 'react';

const HotelCard = ({ hotel }) => {
  return (
    <div className='bg-white rounded-2xl shadow-md p-4 w-80 mx-auto mb-6 flex flex-col'>
      <div className='w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden'>
        {hotel.max_1440_photo_url ? (
          <img
            src={hotel.max_1440_photo_url}
            alt={hotel.hotel_name}
            className='w-full h-full object-cover'
          />
        ) : (
          <span className='text-gray-400'>No Image</span>
        )}
      </div>
      <div className='mt-4 flex-1 flex flex-col'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {hotel.hotel_name}
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          {hotel.address || 'No address available'}
        </p>

        <div className='mt-2 flex flex-wrap gap-2 text-sm text-gray-600'>
          <span>🏙️ {hotel.city || 'N/A'}</span>
          <span>🗺️ {hotel.district || 'N/A'}</span>
        </div>

        {hotel.price_breakdown?.all_inclusive_price && (
          <p className='text-purple-600 font-medium mt-2'>
            ${hotel.price_breakdown.all_inclusive_price.toFixed(2)} total
          </p>
        )}

        {hotel.review_score && (
          <p className='mt-1 text-sm text-gray-600'>
            ⭐ {hotel.review_score} – {hotel.review_score_word}
          </p>
        )}

        <a
          href={hotel.url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold text-center'
          style={{ textDecoration: 'none' }}
        >
          View on Booking.com
        </a>
      </div>
    </div>
  );
};

export default HotelCard;
