import { HOME_FILTERS } from '@/constants/HomeFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { HomeFilterSelector } from './HomeFilterSelector';
import { GiSettingsKnobs } from 'react-icons/gi';

const HomeFilters = ({ isOpen, setIsOpen, handleApplyFilters }) => {
  const [filter, setFilter] = useState([]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className='flex items-center justify-center gap-2 px-6 py-3 text-black rounded-xl font-semibold mb-2 mx-auto'>
            <GiSettingsKnobs size={27} />
          </button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-sm p-2 rounded-2xl bg-white shadow-2xl border-0 z-[1000] pointer-events-auto'>
          <DialogHeader className='mb-2'>
            <DialogTitle className='text-xl font-bold text-black'>
              Filter Search
            </DialogTitle>
            <DialogDescription className='text-sm text-black/60'>
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
            className='w-full px-6 py-3 mt-2 bg-[#00BFFF] text-white rounded-xl font-semibold shadow-lg hover:bg-[#e6f7ff] hover:text-[#00BFFF] transition-colors'
          >
            Apply Filters
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomeFilters;
