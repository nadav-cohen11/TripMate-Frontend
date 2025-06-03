import { useQuery } from '@tanstack/react-query';
import { FILTERS } from '@/constants/filters';
import { extractBackendError } from '@/utils/errorUtils';
import { toast } from 'react-toastify';
import axios from 'axios';

const fetchNearbyPlaces = async (filter, userLocation, radius = 500) => {
  if (!userLocation || userLocation.length !== 2) {
    throw new Error("Invalid user location");
  }

  const nodes = FILTERS[filter]
    .map((f) => `${f}(around:${radius},${userLocation[0]},${userLocation[1]});`)
    .join('\n');

  const query = `
    [out:json][timeout:25];
    (${nodes});
    out body;
  `;

  const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
    headers: { 'Content-Type': 'text/plain' }
  });
  return response.data.elements || [];
};


export const useNearbyPlaces = (filter, userLocation, radius = 500) => {
  const enabled = !!userLocation?.length && !!FILTERS[filter];

  const { data: places = [], isLoading: loading, error } = useQuery({
    queryKey: ['nearbyPlaces', filter, userLocation, radius],
    queryFn: () => fetchNearbyPlaces(filter, userLocation, radius),
    enabled,
    staleTime: 1000 * 60 * 5,  
    cacheTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
    retry: 1,
  });
  

  return { places, loading, error };
};

