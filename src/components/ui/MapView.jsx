import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const centerDefault = { lat: 32.0853, lng: 34.7818 }; 

export default function MapView({ users = [] }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("User location error:", err);
      }
    );
  }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation || centerDefault}
      zoom={12}
    >

      {currentLocation && <Marker position={currentLocation} label="You" />}

     
      {users.map((user, i) => (
        <Marker key={i} position={{ lat: user.lat, lng: user.lng }} label={user.name} />
      ))}
    </GoogleMap>
  );
}
