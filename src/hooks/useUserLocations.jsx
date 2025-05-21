import { useState, useEffect } from 'react';
import { getUserLocation, getUsersLocations } from '@/api/userApi';

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
          setCoordinates([]);
        }
      } catch (error) {
        setUserLocation([]);
        setUserLocation(null);
        setCoordinates([]);
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