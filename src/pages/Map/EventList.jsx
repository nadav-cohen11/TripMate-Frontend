import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import api from '../../api/axios';
import { useState, useEffect } from 'react';
import { FILTER_OPTIONS } from '@/utils/OptionsData';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fetchEvents = async ({ queryKey }) => {
  const [_key, { lat, lon, keyword }] = queryKey;
  const response = await api.get('/trips/events', {
    params: { lat, lon, keyword },
  });
  return response.data;
};

export const EventList = ({ lat, lon, keyword: externalKeyword }) => {
  const [selectedFilter, setSelectedFilter] = useState('Music');
  const [debouncedKeyword, setDebouncedKeyword] = useState('Music');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(selectedFilter || externalKeyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [selectedFilter, externalKeyword]);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['events', { lat, lon, keyword: debouncedKeyword }],
    queryFn: fetchEvents,
    enabled: !!lat && !!lon,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return (
    <motion.div
      className="mt-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-[#00BFFF]/10 max-w-6xl mx-auto px-4 lg:px-12"
      initial='hidden'
      animate='show'
      variants={containerVariants}
    >
      <motion.h2
        className='text-3xl font-bold mb-4 text-black text-center tracking-wide'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      >
        Nearby Events Just for You 🎉
      </motion.h2>

      <div className='flex flex-wrap justify-center gap-2 mb-4'>
        {FILTER_OPTIONS.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() =>
              setSelectedFilter((prev) => (prev === label ? '' : label))
            }
            className={`px-3 py-2 rounded-xl border transition text-xs font-semibold tracking-wide shadow-sm ${
              selectedFilter === label
                ? 'bg-[#00BFFF] text-black border-[#00BFFF] shadow-lg'
                : 'bg-white text-black border-[#4a90e2]/30 hover:bg-[#eaf4fd]'
            }`}
          >
            <span className='mr-1 text-lg'>{icon}</span> {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className='text-center text-gray-600 animate-pulse'>
          Loading events near you...
        </p>
      )}

      {error && (
        <p className='text-center text-red-500'>
          Error fetching events. Please try again later.
        </p>
      )}

      {!isLoading && !events?.length && (
        <p className='text-center text-gray-500'>No events found nearby.</p>
      )}

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center'>
        {events?.map((event) => (
          <motion.div key={event.id} whileHover={{ scale: 1.02 }}>
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
