import { publishReview } from '@/api/reviewApi';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmedMatch = ({
  match,
  openReviewId,
  setOpenReviewId,
  handleBlock,
  hadTrip,
}) => {
  const friend = match.otherUser;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleOpenReview = (matchId) => {
    setOpenReviewId(matchId);
    setReview('');
    setRating(0);
  };

  const submitReviewMutation = useMutation({
    mutationFn: ({ revieweeId, review, rating }) =>
      publishReview(revieweeId, review, rating),
    onSuccess: () => {
      toast.success('Review submitted successfully');
    },
    onError: (error) => {
      toast.error('Review already submitted');
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
    <div
      key={match._id}
      className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 flex flex-row items-center w-full mb-4 space-x-4 hover:shadow-xl transition-all duration-300'
      style={{ overflow: 'hidden' }}
    >
      <div className="relative">
        <img
          onClick={() => navigate(`/profile/${friend._id}`)}
          src={
            Array.isArray(friend.photos) && friend.photos.length > 0
              ? friend.photos[0].url
              : ''
          }
          alt={friend.fullName}
          className='w-14 h-14 rounded-full border-2 border-blue-200 object-cover flex-shrink-0 shadow-md'
        />
        <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
      </div>
      <div className='flex-1 flex flex-col justify-center space-y-1.5 min-w-0'>
        <div className='flex items-center gap-2'>
          <div
            className='text-base font-semibold truncate text-gray-800'
            title={friend.fullName}
          >
            {friend.fullName}
          </div>
          <div className='text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium'>
            {match.compatibilityScore}% match
          </div>
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
                  } focus:outline-none hover:scale-110 transition-transform`}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className='w-full p-3 border border-blue-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/50'
              rows={2}
              placeholder='Write your review...'
              value={review}
              onChange={(e) => setReview(e.target.value)}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            />
            <div className='flex flex-row gap-3 self-end mt-2'>
              <button
                className='px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition text-gray-600'
                onClick={() => setOpenReviewId(null)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-1.5 bg-white text-blue-500 border border-blue-200 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50'
                onClick={() => handleSubmitReview(friend._id)}
                disabled={rating === 0}
              >
                Submit Review
              </button>
            </div>
          </div>
        ) : (
          <div className='flex justify-end mt-2 gap-2'>
            <button
              className='px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition flex items-center gap-1.5'
              onClick={() => handleBlock(match._id)}
            >
              <Shield size={14} />
              Block
            </button>
            <button
              disabled={!hadTrip}
              onClick={() => handleOpenReview(match._id)}
              className='px-4 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1.5
                bg-white text-blue-500 border border-blue-200 hover:bg-blue-50
                disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed'
            >
              <MessageSquare size={14} />
              {!hadTrip ? 'Trip Required' : 'Write Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmedMatch;
