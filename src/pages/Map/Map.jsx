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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { SlidersHorizontal } from 'lucide-react';

export const Map = () => {
  const [filter, setFilter] = useState("Bars");
  const [radius, setRadius] = useState(500);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState("Bars");
  const [appliedRadius, setAppliedRadius] = useState(500);

  const debouncedRadius = useDebounce(radius, 600);
  const debouncedFilter = useDebounce(filter, 600);

  const { userLocations, userLocation, coordinates, loading: loadingUsers } = useUserLocations();
  
  const { places, loading: loadingPlaces } = useNearbyPlaces(appliedFilter, coordinates, appliedRadius);

  const isLoading = loadingUsers || loadingPlaces;

  const handleApplyFilters = () => {
    setAppliedFilter(filter);
    setAppliedRadius(radius);
    setIsFilterDialogOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eaf4fd] via-[#eaf4fd] to-[#cbe7fa]">
      <TripMateTitle />

      <div className="z-10 relative flex flex-col gap-2 pt-28 px-4 md:px-12 max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-[#4a90e2] text-center tracking-wide">Find Near You</h2>
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow-lg hover:bg-[#357abd] transition-colors mb-2 mx-auto">
              <SlidersHorizontal size={20} />
              <span>Open Filters</span>
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm p-2 rounded-2xl bg-white shadow-2xl border-0 z-[1000] pointer-events-auto">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold text-gray-900">Filter Search</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">Adjust your search criteria for places and events.</DialogDescription>
            </DialogHeader>
            <FilterSelector activeFilter={filter} setFilter={setFilter} filterIcons={FILTER_ICONS} />
            <RadiusSlider radius={radius} setRadius={setRadius} />
            <button 
              onClick={handleApplyFilters}
              className="w-full px-6 py-3 mt-2 bg-[#4a90e2] text-white rounded-xl font-semibold shadow-lg hover:bg-[#357abd] transition-colors"
            >
              Apply Filters
            </button>
          </DialogContent>
        </Dialog>
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
            filter={filter}
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