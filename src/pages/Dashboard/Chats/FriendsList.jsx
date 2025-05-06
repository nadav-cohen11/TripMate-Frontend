import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Match from './Match';

export function FriendsList({ userId, socket, setChats, matches }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Add Your friends </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Chat with your friends</DialogTitle>
          <DialogDescription>
            Add your friends and start chatting with them.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {matches && matches.length > 0 ? (
            matches.map((match) => (
              <Match
                key={match._id}
                userId={userId}
                match={match}
                socket={socket}
                setChats={setChats}
              />
            ))
          ) : (
            <div className='text-center text-gray-500 py-8'>
              No friends found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
