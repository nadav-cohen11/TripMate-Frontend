import { useState, useEffect } from 'react';
import { getUserLocation, getUsersLocations } from '@/api/userApi';
import { toast } from 'react-toastify';
import { extractBackendError } from '@/utils/errorUtils';

export const useUserLocations = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);

        const [userLoc, allUsersLoc] = await Promise.all([
          getUserLocation(),
          getUsersLocations()
        ]);
        
        setUserLocation(userLoc);
        setUserLocations(allUsersLoc);
        
        if (userLoc && userLoc.location && userLoc.location.coordinates) {
          setCoordinates(userLoc.location.coordinates);
        } else if (Array.isArray(userLoc) && userLoc.length === 2) {
          setCoordinates(userLoc);
        } else {
          console.warn("User location data is not in expected format:", userLoc);
          setCoordinates([]);
        }
      } catch (error) {
        setUserLocation(null);
        setCoordinates([]);
        toast.error(extractBackendError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { 
    userLocations, 
    userLocation, 
    coordinates, 
    loading 
  };
};