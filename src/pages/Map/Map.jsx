import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getUsersLocations } from '@/api/userApi';
import { toast } from 'react-toastify';
import { extractBackendError } from '@/utils/errorUtils';
import { FaSpinner } from 'react-icons/fa';

const DEFAULT_COORDINATES = [51.505, -0.09];
const DEFAULT_PHOTO = '/assets/images/Annonymos_picture.jpg';

const Map = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const allUsersLocation = await getUsersLocations();

        if (Array.isArray(allUsersLocation)) {
          setUserLocations(allUsersLocation);
        } else {
          toast.error("Failed to load user locations.");
        }
      } catch (err) {
        const message = extractBackendError(err);
        toast.error(message || "Failed to fetch user locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const renderUserMarker = (user, index) => {
    const { fullName, location, photos = [] } = user;
    const [lat, lng] = location?.latitude && location?.longitude
      ? [location.latitude, location.longitude]
      : location?.coordinates || DEFAULT_COORDINATES;

    const photoUrl = photos[0] || DEFAULT_PHOTO;

    const userIcon = L.icon({
      iconUrl: photoUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60], 
      className: 'rounded-full border-2 border-white shadow-xl transform hover:scale-110 transition-all duration-300 ease-out cursor-pointer',
    });

    return (
      <Marker key={index} position={[lat, lng]} icon={userIcon}>
        <Popup className="popup-style">
          <div className="text-center max-w-[250px] p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">{fullName || 'Unnamed User'}</h3>
            <p className="text-sm text-gray-500">
              <strong>Lat:</strong> {lat.toFixed(4)} <br />
              <strong>Lng:</strong> {lng.toFixed(4)}
            </p>
            <div className="mt-3">
              <img
                src={photoUrl}
                alt={`${fullName || 'User'}'s avatar`}
                className="w-[130px] h-[130px] rounded-lg object-cover mx-auto mt-2 shadow-md"
              />
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">Discover User Locations</h2>
      {loading ? (
        <div className="flex justify-center items-center h-[500px]">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      ) : (
        <div className="map-container relative w-full h-[500px] rounded-xl shadow-lg overflow-hidden border border-gray-300 bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-300">
          <MapContainer
            center={DEFAULT_COORDINATES}
            zoom={2}
            scrollWheelZoom
            className="w-full h-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {userLocations.map(renderUserMarker)}
          </MapContainer>
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-gray-600 text-lg">Click on a marker to view more details about the user.</p>
      </div>
    </div>
  );
};

export default Map;
