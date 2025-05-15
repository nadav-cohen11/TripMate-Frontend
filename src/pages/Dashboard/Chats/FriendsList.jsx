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
        <Button  variant='outline' className="w-full sm:w-auto">
          Add Your friends
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-[425px] px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Chat with your friends</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Add your friends and start chatting with them.
          </DialogDescription>
        </DialogHeader>
        <div
          className="
            grid gap-4 py-4
            max-h-[60vh] sm:max-h-[70vh]
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
          "
        >
          {matches && matches.length > 0 ? (
            matches.map((match) => (
              <Match
                key={match._id}
                userId={userId}
                match={match}
                socket={socket}
                setChats={setChats}
                buttonContent="Chat"
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No friends found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
