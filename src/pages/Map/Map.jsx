import { useUserLocations } from "@/hooks/useUserLocations";
import { useNearbyPlaces } from "@/hooks/useNearbyPlaces";
import { useState } from "react";
import { FilterSelector } from "./FilterSelector";
import { Spinner } from "@/components/ui/spinner";
import { MapContainerWrapper } from "./MapContainerWrapper";
import { RadiusSlider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import { EventList } from "./EventList";

export const Map = () => {
  const [filter, setFilter] = useState("Bars");
  const [radius, setRadius] = useState(500);
  const [keyword, setKeyword] = useState('');

  const debouncedRadius = useDebounce(radius, 600);
  const debouncedFilter = useDebounce(filter, 600);

  const { userLocations, userLocation, coordinates, loading: loadingUsers } = useUserLocations();
  const debouncedUserLocation = useDebounce(userLocation?.location?.coordinates, 600);

  const { places, loading: loadingPlaces } = useNearbyPlaces(debouncedFilter, coordinates, debouncedRadius);

  const isLoading = loadingUsers || loadingPlaces;

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">TripMate</h1>
      <FilterSelector activeFilter={filter} setFilter={setFilter} />
      <RadiusSlider radius={radius} setRadius={setRadius} />

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <MapContainerWrapper
            userLocations={userLocations}
            places={places}
            userLocation={coordinates}
            filter={filter}
          />
        </>
      )}
    <EventList
  lat={coordinates[1]}
  lon={coordinates[0]}
  keyword={debouncedFilter}
/>

    </div>
  );
};

export default Map;
