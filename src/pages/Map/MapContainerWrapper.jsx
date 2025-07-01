import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { UserMarker } from "./UserMarker";
import { PlaceMarker } from "./PlaceMarker";
import { motion } from "framer-motion";

export const MapContainerWrapper = ({
  userLocations = [],
  places = [],
  userLocation = [],
  filter,
}) => {
  const defaultCenter = [51.505, -0.09];
  const hasValidLocation = Array.isArray(userLocation) && userLocation.length === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='relative mx-auto mt-6 w-full max-w-screen-xl px-4 md:px-8'
    >
      <div className='relative'>
        <MapContainer
          center={hasValidLocation ? userLocation : defaultCenter}
          zoom={14}
          scrollWheelZoom
          className='h-[70vh] w-full rounded-2xl shadow-2xl border-2 border-[#00BFFF]/30 overflow-hidden'
          zoomControl={false}
        >
          <TileLayer
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors & OpenStreetMap'
          />
          <ZoomControl position='bottomright' />

          {userLocations.map((user, idx) => (
            <UserMarker key={idx} user={user} />
          ))}

          {places.map((place, idx) => (
            <PlaceMarker key={`place-${idx}`} place={place} filter={filter} />
          ))}
        </MapContainer>

        <div className='absolute bottom-4 left-4 z-[1000] flex flex-col gap-2'>
          <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2 flex flex-col gap-2 border border-[#00BFFF]/20'>
            <button
              onClick={() => {
                const map =
                  document.querySelector('.leaflet-container')?._leaflet_map;
                if (map) {
                  map.setView(userLocation, 14);
                }
              }}
              className='p-2 bg-[#eaf4fd] text-[#00BFFF] rounded-lg hover:bg-[#d2eafd] transition-colors border border-[#00BFFF]/20'
              title='Center on my location'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>

        <div className='absolute top-4 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-[#00BFFF]/20'>
          <div className='flex items-center gap-4'>
            <div className='h-8 w-px bg-[#00BFFF]/30' />
            <div className='text-center'>
              <div className='text-sm font-medium text-[#00BFFF]'>Places</div>
              <div className='text-lg font-bold text-[#00BFFF]'>
                {places.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
