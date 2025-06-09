import { MdLocalBar, MdRestaurant, MdHotel, MdLocalCafe } from 'react-icons/md';

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
    Bars: MdLocalBar,
    Restaurants: MdRestaurant,
    Hotels: MdHotel,
    Cafes: MdLocalCafe,
  };
