import { MapContainer, TileLayer } from "react-leaflet";
import { UserMarker } from "./UserMarker";
import { PlaceMarker } from "./PlaceMarker";

export const MapContainerWrapper = ({
  userLocations = [],
  places = [],
  userLocation = [],
  filter,
}) => {
  const defaultCenter = [51.505, -0.09];
  const hasValidLocation = Array.isArray(userLocation) && userLocation.length === 2;

  return (
    <MapContainer
      center={hasValidLocation ? userLocation : defaultCenter}
      zoom={15}
      scrollWheelZoom
      className="w-full h-[70vh] rounded-lg shadow-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {userLocations.map((user, idx) => (
        <UserMarker key={idx} user={user} />
      ))}

      {places.map((place, idx) => (
        <PlaceMarker key={`place-${idx}`} place={place} filter={filter} />
      ))}
    </MapContainer>
  );
};
