export const getCurrentLocation = async (maxRetries = 2, delay = 1000) => {
    let retries = 0;
  
    const getPosition = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          return reject(new Error("Geolocation is not supported by your browser"));
        }
  
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                reject(new Error("Location permission denied"));
                break;
              case err.POSITION_UNAVAILABLE:
                reject(new Error("Location unavailable"));
                break;
              case err.TIMEOUT:
                reject(new Error("Location request timed out"));
                break;
              default:
                reject(new Error("Unknown location error"));
                break;
            }
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    };
  
    while (retries <= maxRetries) {
      try {
        const position = await getPosition();
        return {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
      } catch (err) {
        if (
          err.message.includes("Unknown location error") &&
          retries < maxRetries
        ) {
          retries++;
          await new Promise((res) => setTimeout(res, delay));
        } else {
          throw err;
        }
      }
    }
  
    throw new Error("Failed to get location after retries");
  };
  