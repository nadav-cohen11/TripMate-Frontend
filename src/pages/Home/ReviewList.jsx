import { getUserReviews } from '@/api/reviewApi';
import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
const ReviewList = ({ userId }) => {

  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    const res = await getUserReviews(userId);
    if (Array.isArray(res) && res.length > 0) {
      return res;
    } else {
      return [];
    }
  };

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews-list', userId],
    queryFn: fetchReviews,
    enabled: !!userId,
    onError: () => setError('Could not load reviews.'),
    staleTime: 5 * 60 * 1000,
  });
  
  if (isLoading) return <p className="mt-6 text-sm text-gray-500">Loading reviews...</p>;
  if (error) return <p className="mt-6 text-sm text-red-500">{error}</p>;

  if (!reviews || reviews.length === 0) {
    return <div className="mt-6 text-sm text-gray-500 italic">No reviews yet.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => {
          return (
            <div key={review._id} className="flex items-start gap-3 border-b pb-3">
              <img
                src={review.reviewerId?.photos?.[0] || '/assets/images/Annonymos_picture.jpg'}
                alt={review.reviewerId?.fullName || 'Reviewer'}
                className="w-10 h-10 rounded-full object-cover border bg-gray-100"
              />
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.reviewerId?.fullName || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 text-yellow-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {review.comment || <span className="italic text-gray-400">No comment provided.</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewList;