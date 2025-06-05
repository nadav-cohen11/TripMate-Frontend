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
  const [selectedFilter, setSelectedFilter] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

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
      className="mt-10 bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl font-bold mb-4 text-gray-800 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      >
         Nearby Events Just for You 🎉
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {FILTER_OPTIONS.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() =>
              setSelectedFilter((prev) => (prev === label ? '' : label))
            }
            className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
              selectedFilter === label
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{icon}</span> {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="text-center text-gray-600 animate-pulse">
          Loading events near you...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">
          Error fetching events. Please try again later.
        </p>
      )}

      {!isLoading && !events?.length && (
        <p className="text-center text-gray-500">No events found nearby.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <motion.div key={event.id} whileHover={{ scale: 1.02 }}>
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
