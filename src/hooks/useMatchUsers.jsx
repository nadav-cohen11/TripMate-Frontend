import { useQuery } from '@tanstack/react-query';
import { NonMatchedUsers } from '@/api/matchApi';
import { getUserLocation } from '@/api/userApi';
import { calculateDistance } from '@/utils/calculateDistanceUtils';

const generateCompatibilityScore = () => Math.floor(Math.random() * 101);

export const useMatchUsers = () => {
  return useQuery({
    queryKey: ['matchUsers'],
    queryFn: async () => {
      const [users, currentUser] = await Promise.all([
        NonMatchedUsers(),
        getUserLocation()
      ]);

      return users.map(user => {
        const score = generateCompatibilityScore();
        const coordsA = user.location?.coordinates;
        const coordsB = currentUser?.location?.coordinates;

        let distance = null;
        if (Array.isArray(coordsA) && Array.isArray(coordsB)) {
          const [lngA, latA] = coordsA;
          const [lngB, latB] = coordsB;
          distance = calculateDistance(latB, lngB, latA, lngA);
        }

        return {
          ...user,
          distance: distance !== null ? Math.round(distance) : null,
          compatibilityScore: score,
          aiSuggested: score >= 1,
        };
      });
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
