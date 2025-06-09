import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const DEFAULT_PHOTO = "/assets/images/Annonymos_picture.jpg";

const createUserIcon = (photoUrl, isHovered = false) => {
  return L.divIcon({
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: ${isHovered 
          ? "0 4px 20px rgba(37,99,235,0.6)" 
          : "0 2px 12px rgba(37,99,235,0.4)"};
        overflow: hidden;
        transform: ${isHovered ? "scale(1.1)" : "scale(1)"};
        transition: all 0.2s ease-in-out;
      ">
        <img 
          src="${photoUrl}" 
          alt="User" 
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
        />
      </div>
    `,
    className: "custom-user-icon",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });
};

export const UserMarker = ({ user }) => {
  const { fullName, location, photos = [], socialLinks = {} } = user;
  const [lat, lng] = location.coordinates;
  const [isHovered, setIsHovered] = useState(false);
  const userIcon = createUserIcon(photos?.[0]?.url || DEFAULT_PHOTO, isHovered);

  return (
    <Marker 
      position={[lat, lng]} 
      icon={userIcon}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Popup>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-56 space-y-3 text-center font-sans p-2"
        >
          <div className="relative">
            <img
              src={photos?.[0]?.url || DEFAULT_PHOTO}
              alt={fullName || "User"}
              className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
              <span className="text-xs font-medium text-gray-600">Traveler</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            {fullName || "Unnamed User"}
          </h3>

          <div className="flex justify-center space-x-4 text-xl">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                className="text-pink-500 hover:text-pink-600 transition-colors duration-200"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </motion.div>
      </Popup>
    </Marker>
  );
};
