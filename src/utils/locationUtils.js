export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    if (!response.ok) {
      console.error(`Error fetching location: ${response.status} ${response.statusText}`);
      return "Unknown location";
    }
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || "Unknown location";
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown location";
  }
};
