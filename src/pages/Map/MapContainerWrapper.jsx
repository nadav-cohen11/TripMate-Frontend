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
    <div className="relative mx-auto mt-6 w-full max-w-screen-xl px-4 md:px-8">
      <MapContainer
        center={hasValidLocation ? userLocation : defaultCenter}
        zoom={14}
        scrollWheelZoom
        className="h-[70vh] w-full rounded-2xl shadow-xl border border-gray-200"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors & OpenStreetMap'
        />

        {userLocations.map((user, idx) => (
          <UserMarker key={idx} user={user} />
        ))}

        {places.map((place, idx) => (
          <PlaceMarker key={`place-${idx}`} place={place} filter={filter} />
        ))}
      </MapContainer>
    </div>
  );
};
