export const getLocationName = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TripMate App'
        }
      });
      
      const data = await response.json();
      
      if (data) {
        if (data.address) {
          if (data.address.city && data.address.country) {
            return `${data.address.city}, ${data.address.country}`;
          }
          else if ((data.address.town || data.address.village) && data.address.country) {
            return `${data.address.town || data.address.village}, ${data.address.country}`;
          }
          else {
            return data.display_name.split(',').slice(0, 2).join(',');
          }
        }
        return data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : 'Unknown location';
      }
      return 'Unknown location';
    } catch (error) {
      return 'Location fetch error';
    }
  };
  
  const throttledRequests = new Map();
  const THROTTLE_DELAY = 1100; 
  
  export const throttledGetLocationName = (lat, lng) => {
    const key = `${lat},${lng}`;
    
    if (throttledRequests.has(key)) {
      return throttledRequests.get(key);
    }
    
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve(getLocationName(lat, lng));
      }, throttledRequests.size * THROTTLE_DELAY);
    });
    
    throttledRequests.set(key, promise);
    
    promise.finally(() => {
      setTimeout(() => {
        throttledRequests.delete(key);
      }, THROTTLE_DELAY);
    });
    
    return promise;
  };