import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FILTER_ICONS } from "@/constants/filters";

const createDivIcon = (Icon) =>
  L.divIcon({
    html: renderToStaticMarkup(
      <div className="text-red-600 text-2xl">
        <Icon />
      </div>
    ),
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

export const PlaceMarker = ({ place, filter }) => {
  const Icon = FILTER_ICONS[filter];
  const customIcon = createDivIcon(Icon);
  const lat = place.lat || place.latitude;
  const lon = place.lon || place.longitude;

  if (!lat || !lon) return null;

  const { tags = {} } = place;

  return (
    <Marker position={[parseFloat(lat), parseFloat(lon)]} icon={customIcon}>
      <Popup>
        <div className="text-center max-w-[200px]">
          <h4 className="font-semibold text-indigo-700">
            {tags.name || tags["name:en"] || tags["name:he"] || "Unknown Place"}
          </h4>
          {tags["addr:street"] && tags["addr:housenumber"] && (
            <p className="text-sm text-gray-700">
              {tags["addr:street"]} {tags["addr:housenumber"]}
            </p>
          )}
          {tags["addr:city"] && (
            <p className="text-sm text-gray-700">City: {tags["addr:city"]}</p>
          )}
          {tags["contact:phone"] && (
            <p className="text-sm text-gray-700">Phone: {tags["contact:phone"]}</p>
          )}
          {tags.opening_hours && (
            <p className="text-sm text-gray-700">
              Hours: {tags.opening_hours}
            </p>
          )}
          {tags.website && (
            <a
              href={tags.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Website
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
