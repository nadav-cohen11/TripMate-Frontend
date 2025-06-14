import { HOME_FILTERS } from '@/constants/HomeFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { HomeFilterSelector } from './HomeFilterSelector';

const HomeFilters =  ({isOpen,setIsOpen,handleApplyFilters}) => {
  const [filter, setFilter] = useState([]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className='flex items-center justify-center gap-2 px-6 py-3 bg-[#4a90e2] text-white rounded-xl font-semibold shadow-lg hover:bg-[#357abd] transition-colors mb-2 mx-auto'>
            <SlidersHorizontal size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-sm p-2 rounded-2xl bg-white shadow-2xl border-0 z-[1000] pointer-events-auto'>
          <DialogHeader className='mb-2'>
            <DialogTitle className='text-xl font-bold text-gray-900'>
              Filter Search
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-500'>
              Adjust your search criteria for your next match.
            </DialogDescription>
          </DialogHeader>
          <HomeFilterSelector
            activeFilter={filter}
            setFilter={setFilter}
            filters={HOME_FILTERS}
            filter={filter}
          />
          <button
            onClick={() => handleApplyFilters(filter)}
            className='w-full px-6 py-3 mt-2 bg-[#4a90e2] text-white rounded-xl font-semibold shadow-lg hover:bg-[#357abd] transition-colors'
          >
            Apply Filters
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomeFilters;
