import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FILTER_ICONS } from "@/constants/filters";

const createDivIcon = (Icon) => {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        background: "linear-gradient(135deg, #2563eb 70%, #60a5fa 100%)",
        borderRadius: "50%",
        boxShadow: "0 2px 12px rgba(37,99,235,0.4)",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2.5px solid #1e40af",
      }}
    >
      <Icon style={{ color: "#fff", fontSize: 22 }} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "custom-div-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

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
