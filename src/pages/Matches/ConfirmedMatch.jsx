import { publishReview } from '@/api/reviewApi';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const ConfirmedMatch = ({
  match,
  openReviewId,
  setOpenReviewId,
}) => {
  console.log('sdasd');
  const friend = match.otherUser;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleOpenReview = (matchId) => {
    setOpenReviewId(matchId);
    setReview('');
    setRating(0);
  };

  const submitReviewMutation = useMutation({
    mutationFn: ({ revieweeId, review, rating }) =>
      publishReview(revieweeId, review, rating),
    onSuccess: () => {
      console.log('Review submitted successfully');
    },
    onError: (error) => {
      console.error('Failed to submit review:', error);
    },
  });

  const handleSubmitReview = (revieweeId) => {
    submitReviewMutation.mutate({ revieweeId, review, rating });
    setOpenReviewId(null);
    setReview('');
    setRating(0);
  };

  if (!friend) return null;
  return (
    <>
      <div
        key={match._id}
        className='bg-white/90 rounded-lg shadow-md p-4 flex flex-row items-center w-full mb-4 space-x-4'
        style={{ overflow: 'hidden' }}
      >
        <img
          src={
            Array.isArray(friend.photos) && friend.photos.length > 0
              ? friend.photos[0].url
              : ''
          }
          alt={friend.fullName}
          className='w-12 h-12 rounded-full border-2 border-blue-200 object-cover flex-shrink-0'
        />
        <div className='flex-1 flex flex-col justify-center space-y-1 min-w-0'>
          <div
            className='text-base font-semibold truncate'
            title={friend.fullName}
          >
            {friend.fullName}
          </div>
          <div
            className='text-gray-600 text-sm truncate'
            title={friend.bio}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {friend.bio}
          </div>
          <div className='text-xs text-blue-700 font-medium truncate'>
            Compatibility: {match.compatibilityScore}%
          </div>
          {openReviewId === match._id ? (
            <div className='flex flex-col items-end w-full mt-2 space-y-2'>
              <div className='flex items-center space-x-1 mb-2'>
                <span className='text-sm text-gray-700 mr-2'>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    className={`text-xl ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    } focus:outline-none`}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className='w-full p-2 border border-blue-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300'
                rows={2}
                placeholder='Write your review...'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
              <div className='flex flex-row gap-4 self-end mt-2'>
                <button
                  className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition mr-2'
                  onClick={() => setOpenReviewId(null)}
                >
                  Cancel
                </button>
                <button
                  className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition'
                  onClick={() => handleSubmitReview(friend._id)}
                  disabled={rating === 0}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className='flex justify-end mt-2'>
              <button
                className='px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition'
                onClick={() => handleOpenReview(match._id)}
              >
                Review
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmedMatch;
