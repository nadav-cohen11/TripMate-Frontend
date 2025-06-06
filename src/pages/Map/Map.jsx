import { useUserLocations } from "@/hooks/useUserLocations";
import { useNearbyPlaces } from "@/hooks/useNearbyPlaces";
import { useState } from "react";
import { FilterSelector } from "./FilterSelector";
import { Spinner } from "@/components/ui/spinner";
import { MapContainerWrapper } from "./MapContainerWrapper";
import { RadiusSlider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import { EventList } from "./EventList";
import { FILTER_ICONS } from "@/constants/filters";
import TripMateTitle from '@/components/ui/TripMateTitle';

export const Map = () => {
  const [filter, setFilter] = useState("Bars");
  const [radius, setRadius] = useState(500);

  const debouncedRadius = useDebounce(radius, 600);
  const debouncedFilter = useDebounce(filter, 600);

  const { userLocations, userLocation, coordinates, loading: loadingUsers } = useUserLocations();
  const debouncedUserLocation = useDebounce(userLocation?.location?.coordinates, 600);

  const { places, loading: loadingPlaces } = useNearbyPlaces(debouncedFilter, coordinates, debouncedRadius);

  const isLoading = loadingUsers || loadingPlaces;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
      <TripMateTitle />

      <div className="z-10 relative flex flex-col gap-6 pt-28 px-6 md:px-12 max-w-screen-md mx-auto">
        <FilterSelector activeFilter={filter} setFilter={setFilter} filterIcons={FILTER_ICONS}   />
        <RadiusSlider radius={radius} setRadius={setRadius} />
      </div>

      <div className="relative z-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Spinner />
          </div>
        ) : (
          <MapContainerWrapper
            userLocations={userLocations}
            places={places}
            userLocation={coordinates}
            filter={filter}
          />
        )}
      </div>

      <EventList
        lat={coordinates?.[1]}
        lon={coordinates?.[0]}
        keyword={debouncedFilter}
      />
    </div>
  );
};

export default Map;
