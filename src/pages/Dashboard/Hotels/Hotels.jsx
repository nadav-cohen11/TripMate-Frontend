import React, { useEffect, useState } from 'react';
import HotelCard from './HotelCard';
import axios from 'axios';
import { getHotels } from '@/api/userApi';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const hotels = await getHotels();
        setHotels(hotels);
        setError(null);
      } catch (err) {
        setError('Failed to fetch hotels');
        setHotels([]);
        console.error('Failed to fetch hotels', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-10 px-4'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow-sm tracking-tight'>
          <span role='img' aria-label='hotel'>
            🏨
          </span>{' '}
          Hotels
        </h1>
        {error && (
          <div className='mb-6 flex justify-center'>
            <span className='bg-red-100 text-red-700 px-4 py-2 rounded shadow text-center'>
              {error}
            </span>
          </div>
        )}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid'></div>
            <span className='ml-4 text-blue-700 text-lg font-medium'>Loading hotels...</span>
          </div>
        ) : (
          <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {hotels.length === 0 && !error && (
              <p className='col-span-full text-center text-gray-500 text-lg'>
                No hotels found.
              </p>
            )}
            {hotels.map((hotel) => (
              <HotelCard key={hotel.hotel_id || hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
