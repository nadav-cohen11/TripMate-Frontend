export const getCurrentLocation = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000, 
  };

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    const mergedOptions = { ...defaultOptions, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          console.warn("Invalid coordinates received.");
          resolve(null);
        } else {
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission denied by the user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Geolocation request timed out.";
            break;
          default:
            errorMessage = `Unknown geolocation error: ${error.message}`;
        }
        
        console.warn(`Location error: ${errorMessage}`);
        resolve(null);
      },
      mergedOptions
    );
  });
};
