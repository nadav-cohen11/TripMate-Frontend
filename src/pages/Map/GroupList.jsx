import { getAllGroups } from '@/api/userApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import Group from './Group';

const GroupList = ({event,msg})  => {

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getAllGroups,
  });


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex-1 inline-block bg-[#eaf4fd] text-[#4a90e2] px-4 py-2 rounded-xl font-semibold shadow hover:bg-[#d2eafd] transition text-center'>
          Share with my TripMates
        </button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-xs sm:max-w-md px-2 sm:px-8 rounded-2xl bg-white shadow-2xl border-0'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl font-bold text-gray-900'>
            Select a Group to Share This Event
          </DialogTitle>
          <DialogDescription className='text-sm sm:text-base text-gray-500'>
            Choose a trip group below to share this event with your friends.
          </DialogDescription>
        </DialogHeader>
        {groups &&
          groups.map((g) => <Group group={g} key={g.id} event={event} msg={msg} />)}
      </DialogContent>
    </Dialog>
  );
}

export default GroupList;