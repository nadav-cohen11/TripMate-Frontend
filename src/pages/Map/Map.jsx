import { getUsersLocations } from "@/api/userApi";
import Typewriter from "@/components/Typewriter";
import { extractBackendError } from "@/utils/errorUtils";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";

const DEFAULT_COORDINATES = [51.505, -0.09];
const DEFAULT_PHOTO = "/assets/images/Annonymos_picture.jpg";

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
        toast.error(
          extractBackendError(err) || "Failed to fetch user locations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const renderUserMarker = (user, index) => {
    const { fullName, location, photos = [] } = user;
    const [lat, lng] =
      location?.latitude && location?.longitude
        ? [location.latitude, location.longitude]
        : location?.coordinates || DEFAULT_COORDINATES;

    const photoUrl = photos[0] || DEFAULT_PHOTO;

    const userIcon = L.icon({
      iconUrl: photoUrl,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      className:
        "rounded-full border-2 border-white shadow-xl transform hover:scale-110 transition-all duration-300 ease-out cursor-pointer",
    });

    return (
      <Marker key={index} position={[lat, lng]} icon={userIcon}>
        <Popup className="popup-style">
          <div className="text-center max-w-[250px] p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">
              {fullName || "Unnamed User"}
            </h3>
            <p className="text-sm text-gray-500">
              <strong>Lat:</strong> {lat.toFixed(4)} <br />
              <strong>Lng:</strong> {lng.toFixed(4)}
            </p>
            <div className="mt-3">
              <img
                src={photoUrl}
                alt={`${fullName || "User"}'s avatar`}
                className="w-[130px] h-[130px] rounded-lg object-cover mx-auto mt-2 shadow-md"
              />
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 flex flex-col items-start py-8 px-4 space-y-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <Typewriter
          text="TripMate"
          className="text-4xl text-black font-bold tracking-wide"
          style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full h-[60vh] text-lg text-gray-800">
          <FaSpinner className="animate-spin text-indigo-600 text-5xl mr-4" />
          <span>Loading the world map...</span>
        </div>
      ) : !userLocations.length ? (
        <div className="flex flex-col items-center justify-center w-full h-[60vh] text-gray-800 text-center">
          <h1 className="text-2xl font-semibold">
            No users to display on the map right now!
          </h1>
          <p className="mt-2">Please check back soon.</p>
        </div>
      ) : (
        <div className="relative w-full h-[70vh] rounded-xl shadow-xl overflow-hidden border border-gray-300">
          <MapContainer
            center={DEFAULT_COORDINATES}
            zoom={2}
            scrollWheelZoom
            className="w-full h-full rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {userLocations.map(renderUserMarker)}
          </MapContainer>
        </div>
      )}
      <div className="w-full max-w-6xl mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🌍 Featured NeatBy ME
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {userLocations.slice(0, 10).map((user, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={user.photos?.[0] || DEFAULT_PHOTO}
                alt={user.fullName || "Traveler"}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 mb-3"
              />
              <p className="text-center font-medium text-gray-700">
                {user.fullName || "Unnamed User"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
