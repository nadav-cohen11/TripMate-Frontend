import React from 'react';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <div className="mt-6 text-sm text-gray-500 italic">No reviews yet.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-[#4a90e2]">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review, idx) => {
          const reviewer = review.reviewer || {};
          const photo = reviewer?.photos?.[0]?.url || '/assets/images/Annonymos_picture.jpg';

          const reviewKey = review._id || review.createdAt || idx;

          return (
            <div key={reviewKey} className="flex items-start gap-3 border-b pb-3">
              <img
                src={photo}
                alt={reviewer?.fullName || 'Reviewer'}
                className="w-10 h-10 rounded-full object-cover border bg-gray-100"
              />
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#4a90e2]">{reviewer?.fullName || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 text-yellow-500 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={`${reviewKey}-star-${i}`}>
                      {i < review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-800 mt-1">
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

export default React.memo(ReviewList);
