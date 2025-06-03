import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

const DEFAULT_PHOTO = "/assets/images/Annonymos_picture.jpg";

export const UserMarker = ({ user }) => {
  const { fullName, location, photos = [], socialLinks = {} } = user;
  const [lat, lng] = location.coordinates;

  const userIcon = L.icon({
    iconUrl: photos?.[0]?.url || DEFAULT_PHOTO,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    className: "rounded-full border-4 border-white shadow-xl",
  });

  return (
    <Marker position={[lat, lng]} icon={userIcon}>
      <Popup>
        <div className="w-48 space-y-3 text-center font-sans">
          <img
            src={photos?.[0]?.url || DEFAULT_PHOTO}
            alt={fullName || "User"}
            className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <h3 className="text-lg font-semibold text-gray-800">{fullName || "Unnamed User"}</h3>

          <div className="flex justify-center space-x-4 text-xl">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition"
                title="Facebook"
              >
                <FaFacebookSquare />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
