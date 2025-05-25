import { useQuery } from '@tanstack/react-query';
import { getConfirmedMatches,getPendingMatches } from '@/api/matchApi';

const useFetchMyMatches = () => {
  const { data,isLoading,error } = useQuery({
    queryKey: ['getMatches'],
    queryFn: getConfirmedMatches,
  });

  const { data: pendingMatches } = useQuery({
    queryKey: ['getPendingMatches'],
    queryFn: getPendingMatches,
  });

  


  if (!data) return { matches: [], isLoading, error };
  const { matches = [], userId } = data;
  const newMatches = matches.map((m) => {
    const otherUser = m.user1Id._id == userId ? m.user2Id : m.user1Id;
    return {
      ...m,
      otherUser,
    };
  });


  return { matches: newMatches,pendingMatches, isLoading, error };
};

export default useFetchMyMatches;
