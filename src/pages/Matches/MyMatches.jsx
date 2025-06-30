import useFetchMyMatches from '@/hooks/useFetchMyMatches';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ConfirmedMatch from './ConfirmedMatch';
import PendingMatch from './PendingMatch';
import { accept, decline } from '@/api/matchApi';
import { toast } from 'react-toastify';
import { block } from '@/api/matchApi';
import TripMateTitle from '@/components/ui/TripMateTitle';

const MyMatches = () => {
  const [openReviewId, setOpenReviewId] = useState(null);
  const [filter, setFilter] = useState('allMatches');
  const [pendingList, setPendingList] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const { matches, pendingMatches, uniqeIdsHadTrip, isLoading, error } =
    useFetchMyMatches();

  useEffect(() => {
    if (matches) setAcceptedList(matches);
    if (pendingMatches) setPendingList(pendingMatches);
  }, [matches, pendingMatches]);

  const acceptMutation = useMutation({
    mutationFn: accept,
    onSuccess: () => {
      window.location.reload();
    },
  });

  const declineMutation = useMutation({
    mutationFn: decline,
    onSuccess: (_, matchId) => {
      setPendingList((prev) => prev.filter((m) => m._id !== matchId));
    },
  });

  const blockMutation = useMutation({
    mutationFn: block,
    onSuccess: (_, matchId) => {
      setAcceptedList((prev) => prev.filter((m) => m._id !== matchId));
      toast.success('User blocked successfully');
    },
  });

  const handleBlock = (matchId) => {
    const confirmation = confirm('Are you sure you want to block this user?');
    if (!confirmation) return;

    blockMutation.mutate(matchId);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-blue-600'>Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl text-red-500'>
          Error: {error.message || 'Failed to load matches.'}
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden'>
      <TripMateTitle />

      <div className='flex flex-col items-center justify-center min-h-screen px-2 z-10'>
        <div
          className='w-full max-w-md bg-white/70 rounded-lg shadow-lg p-4'
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <div className='flex gap-2 mb-2.5'>
            <Button
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition ${
                filter === 'allMatches'
                  ? 'bg-white text-[#4a90e2] border border-[#4a90e2]/20'
                  : 'bg-white text-gray-500 border border-gray-200 hover:text-[#4a90e2] hover:border-[#4a90e2]/20'
              }`}
              onClick={() => setFilter('allMatches')}
            >
              All
            </Button>
            <Button
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition ${
                filter === 'pending'
                  ? 'bg-white text-[#4a90e2] border border-[#4a90e2]/20'
                  : 'bg-white text-gray-500 border border-gray-200 hover:text-[#4a90e2] hover:border-[#4a90e2]/20'
              }`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
          </div>
          {filter === 'allMatches' && (
            <>
              {acceptedList.length === 0 ? (
                <div className='text-gray-500 text-base text-center'>
                  No matches found.
                </div>
              ) : (
                <>
                  <p>Total matches: {acceptedList.length}</p>
                  {acceptedList.map((match) => (
                    <ConfirmedMatch
                      key={match._id}
                      match={match}
                      openReviewId={openReviewId}
                      handleBlock={handleBlock}
                      setOpenReviewId={setOpenReviewId}
                      hadTrip={uniqeIdsHadTrip.includes(match.otherUser._id)}
                    />
                  ))}
                </>
              )}
            </>
          )}

          {filter === 'pending' && (
            <>
              {!Array.isArray(pendingList) || pendingList.length === 0 ? (
                <div className='text-gray-500 text-base text-center'>
                  No pending matches found.
                </div>
              ) : (
                <>
                  <p>Total pending matches: {pendingList.length}</p>
                  {pendingList.map((match) => (
                    <PendingMatch
                      key={match._id}
                      match={match}
                      acceptMutation={acceptMutation}
                      declineMutation={declineMutation}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;
