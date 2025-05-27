import { useQuery } from '@tanstack/react-query';
import { getConfirmedMatches, getPendingMatches } from '@/api/matchApi';
import { useMemo } from 'react';

const useFetchMyMatches = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['getMatches'],
    queryFn: getConfirmedMatches,
  });

  const { data: pendingMatches } = useQuery({
    queryKey: ['getPendingMatches'],
    queryFn: getPendingMatches,
  });

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
    isLoading,
    error,
  };
};


export default useFetchMyMatches;
