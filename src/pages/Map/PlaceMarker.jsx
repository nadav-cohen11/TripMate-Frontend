import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { FILTER_ICONS } from '@/constants/filters';
import { motion } from 'framer-motion';
import { useState } from 'react';

const createDivIcon = (Icon, isHovered = false) => {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        background: isHovered
           ? 'linear-gradient(135deg, #4a90e2 70%, #6cb6f5 100%)'
          : 'linear-gradient(135deg, #4a90e2 70%, #b3d8fa 100%)',
        borderRadius: '50%',
        boxShadow: isHovered
         ? '0 4px 20px rgba(74,144,226,0.6)'
          : '0 2px 12px rgba(74,144,226,0.4)',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2.5px solid #4a90e2',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Icon style={{ color: '#fff', fontSize: 24 }} />
    </div>,
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export const PlaceMarker = ({ place, filter }) => {
  const Icon = FILTER_ICONS[filter];
  const [isHovered, setIsHovered] = useState(false);
  const customIcon = createDivIcon(Icon, isHovered);
  const lat = place.lat || place.latitude;
  const lon = place.lon || place.longitude;

  if (!lat || !lon) return null;

  const { tags = {} } = place;
  const placeName = tags.name || tags['name:en'] || tags['name:he'];

  if (!placeName) return null;

  return (
    <Marker
      position={[parseFloat(lat), parseFloat(lon)]}
      icon={customIcon}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Popup>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center max-w-[250px] p-2'
        >
          <h4 className='font-semibold text-indigo-700 text-lg mb-2'>
            {placeName}
          </h4>
          <div className='space-y-2'>
            {tags['addr:street'] && tags['addr:housenumber'] && (
              <p className='text-sm text-gray-700 flex items-center justify-center gap-1'>
                <span className='text-gray-500'>📍</span>
                {tags['addr:street']} {tags['addr:housenumber']}
              </p>
            )}
            {tags['addr:city'] && (
              <p className='text-sm text-gray-700 flex items-center justify-center gap-1'>
                <span className='text-gray-500'>🏙️</span>
                {tags['addr:city']}
              </p>
            )}
            {tags['contact:phone'] && (
              <p className='text-sm text-gray-700 flex items-center justify-center gap-1'>
                <span className='text-gray-500'>📞</span>
                {tags['contact:phone']}
              </p>
            )}
            {tags.opening_hours && (
              <p className='text-sm text-gray-700 flex items-center justify-center gap-1'>
                <span className='text-gray-500'>🕒</span>
                {tags.opening_hours}
              </p>
            )}
            {tags.website && (
              <a
                href={tags.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 mt-2'
              >
                <span>🌐</span> Visit Website
              </a>
            )}
          </div>
        </motion.div>
      </Popup>
    </Marker>
  );
};
