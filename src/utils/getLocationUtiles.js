export const getCurrentLocation = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000, 
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    const mergedOptions = { ...defaultOptions, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          reject(new Error("Invalid coordinates received."));
        } else {
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Permission denied by the user."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Position unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("Geolocation request timed out."));
            break;
          default:
            reject(new Error(`Unknown geolocation error: ${error.message}`));
        }
      },
      mergedOptions
    );
  });
};
