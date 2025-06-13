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
import React from "react";
export const Map = () => {
  const [filter, setFilter] = useState("Bars");
  const [radius, setRadius] = useState(500);
  const [appliedFilter, setAppliedFilter] = useState("Bars");
  const [appliedRadius, setAppliedRadius] = useState(500);

  const debouncedRadius = useDebounce(radius, 600);
  const debouncedFilter = useDebounce(filter, 600);


  React.useEffect(() => {
    setAppliedFilter(debouncedFilter);
  }, [debouncedFilter]);

  React.useEffect(() => {
    setAppliedRadius(debouncedRadius);
  }, [debouncedRadius]);

  const { userLocations, userLocation, coordinates, loading: loadingUsers } = useUserLocations();
  
  const { places, loading: loadingPlaces } = useNearbyPlaces(appliedFilter, coordinates, appliedRadius);

  const isLoading = loadingUsers || loadingPlaces;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eaf4fd] via-[#eaf4fd] to-[#cbe7fa]">
      <TripMateTitle />

      <div className="z-10 relative flex flex-col gap-4 pt-28">
        <h2 className="text-3xl font-bold mb-2 text-[#4a90e2] text-center tracking-wide">Find Near You</h2>
        
        <div className="flex flex-col items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-3 border border-[#cbe7fa] w-full">
          <FilterSelector activeFilter={filter} setFilter={setFilter} filterIcons={FILTER_ICONS} />
          <RadiusSlider radius={radius} setRadius={setRadius} />
        </div>
      </div>

      <div className="relative z-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Spinner size={50} color="text-[#4a90e2]" />
          </div>
        ) : (
          <MapContainerWrapper
            userLocations={userLocations}
            places={places}
            userLocation={coordinates}
            filter={appliedFilter}
          />
        )}
      </div>

      <EventList
        lat={coordinates?.[1]}
        lon={coordinates?.[0]}
        keyword={appliedFilter}
      />
    </div>
  );
};

export default Map;