import React from 'react';
import Navbar from '@/components/ui/NavBar';
import MapView from "../../components/ui/MapView";

const mockUsers = [
  { name: "Lian", lat: 32.08, lng: 34.78 },
  { name: "Bar", lat: 31.76, lng: 35.21 },
];

const Map = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">מפת המשתמשים</h2>
        <MapView users={mockUsers} />
      </div>
    </div>
  );
};

export default Map;
