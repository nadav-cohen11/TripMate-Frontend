import { FaBeer, FaUtensils, FaHotel, FaCoffee } from 'react-icons/fa';

export const FILTERS = {
    Bars: [
      `node["amenity"="bar"]`,
      `node["amenity"="pub"]`,
      `node["amenity"="nightclub"]`,
    ],
    Restaurants: [
      `node["amenity"="restaurant"]`,
      `node["amenity"="fast_food"]`,
    ],
    Hotels: [
      `node["tourism"="hotel"]`,
      `node["tourism"="hostel"]`,
      `node["tourism"="guest_house"]`,
      `node["tourism"="motel"]`,
    ],
    Cafes: [
      `node["amenity"="cafe"]`,
    ],
  };
  
  export const FILTER_ICONS = {
    Bars: FaBeer,
    Restaurants: FaUtensils,
    Hotels: FaHotel,
    Cafes: FaCoffee,
  };
  