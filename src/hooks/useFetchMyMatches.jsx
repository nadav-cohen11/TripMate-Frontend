import { useQuery } from '@tanstack/react-query';
import { getConfirmedMatches, getPendingMatches } from '@/api/matchApi';
import { useMemo } from 'react';
import { getAllTripsForUser } from '@/api/userApi';

const useFetchMyMatches = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['getMatches'],
    queryFn: getConfirmedMatches,
  });

  const { data: pendingMatches } = useQuery({
    queryKey: ['getPendingMatches'],
    queryFn: getPendingMatches,
  });

  const { data: hadTrips } = useQuery({
    queryKey: ['getHadTrips'],
    queryFn: getAllTripsForUser,
  });
  
  const uniqeIdsHadTrip = useMemo(() => {
    if (!hadTrips) return [];
    const trips = hadTrips.map((trip) => trip.participants.map((p) => p.userId._id));
    return [...new Set(trips.flat())];
  }, [hadTrips]);
  
  const matches = useMemo(() => {
    if (!data) return [];
    const { matches = [], userId } = data;
    return matches.map((m) => {
      const otherUser = m.user1Id._id === userId ? m.user2Id : m.user1Id;
      return { ...m, otherUser };
    });
  }, [data]);

  return {
    matches,
    pendingMatches,
    uniqeIdsHadTrip,
    isLoading,
    error,
  };
};

export default useFetchMyMatches;
