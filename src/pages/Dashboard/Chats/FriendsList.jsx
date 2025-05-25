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
        <Button
          className="
            w-full sm:w-auto
            px-6 py-3
            rounded-xl
            bg-gradient-to-r from-blue-500 to-indigo-600
            text-white
            font-semibold
            shadow-lg
            hover:from-blue-600 hover:to-indigo-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-400
            flex items-center gap-2
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md px-2 sm:px-8 rounded-2xl bg-white shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
            Chat with your friends
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-500">
            Add your friends and start chatting instantly.
          </DialogDescription>
        </DialogHeader>
        <div
          className="
            grid gap-4 py-4
            max-h-[60vh] sm:max-h-[70vh]
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent
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
            <div className="flex flex-col items-center justify-center text-center text-gray-400 py-12">
              <svg
                className="w-12 h-12 mb-2 text-blue-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 118 0 4 4 0 01-8 0z"
                />
              </svg>
              <span>No friends found.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
