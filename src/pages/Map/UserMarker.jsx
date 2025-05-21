import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

const DEFAULT_PHOTO = "/assets/images/Annonymos_picture.jpg";

export const UserMarker = ({ user }) => {
  const { fullName, location, photos = [], socialLinks = {} } = user;
  const [lat, lng] = location.coordinates;

  const userIcon = L.icon({
    iconUrl: photos[0] || DEFAULT_PHOTO,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    className: "rounded-full border-2 border-white shadow-lg",
  });

  return (
    <Marker position={[lat, lng]} icon={userIcon}>
      <Popup className="p-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-indigo-800">{fullName || "Unnamed User"}</h3>

          <div className="flex justify-center space-x-4 text-xl">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
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
                className="text-pink-500 hover:text-pink-600"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            )}
          </div>

          <img
            src={photos[0] || DEFAULT_PHOTO}
            alt={fullName}
            className="w-[100px] h-[100px] rounded-lg object-cover mx-auto"
          />
        </div>
      </Popup>
    </Marker>
  );
};
