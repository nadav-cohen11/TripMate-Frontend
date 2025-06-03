import useFetchMyMatches from '@/hooks/useFetchMyMatches';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { publishReview } from '@/api/reviewApi';
import { Button } from '@/components/ui/button';
import ConfirmedMatch from './ConfirmedMatch';
import PendingMatch from './PendingMatch';
import { accept, decline } from '@/api/matchApi';
import { toast } from 'react-toastify';
import { block } from '@/api/matchApi';

const MyMatches = () => {
  const [openReviewId, setOpenReviewId] = useState(null);
  const [filter, setFilter] = useState('allMatches');
  const [pendingList, setPendingList] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const { matches, pendingMatches, isLoading, error } = useFetchMyMatches();

  useEffect(() => {
    if (matches) setAcceptedList(matches);
    if (pendingMatches) setPendingList(pendingMatches);
  }, [matches, pendingMatches]);

  const acceptMutation = useMutation({
    mutationFn: accept,
    onSuccess: (_, matchId) => {
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
    const confirmation = confirm("Are you sure you want to block this user?")
    if (!confirmation) return

    blockMutation.mutate(matchId)
  }

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
      <div
        className='absolute top-6 left-6 text-2xl text-black font-bold z-20 tracking-wide'
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 140,
        }}
      >
        TripMate
      </div>

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
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-200'
              }`}
              onClick={() => setFilter('allMatches')}
            >
              All
            </Button>
            <Button
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition ${
                filter === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-200'
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
