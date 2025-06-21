import React from 'react';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className='mt-6 text-sm text-gray-400 italic'>No reviews yet.</div>
    );
  }

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-bold mb-4 text-gray-700'>Reviews</h3>
      <div className='space-y-4'>
        {reviews.map((review, idx) => {
          const reviewer = review.reviewer || {};
          const photo =
            reviewer?.photos?.[0]?.url ||
            '/assets/images/Annonymos_picture.jpg';

          const reviewKey = review._id || review.createdAt || idx;

          return (
            <div
              key={reviewKey}
              className='flex items-start gap-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100'
            >
              <img
                src={photo}
                alt={reviewer?.fullName || 'Reviewer'}
                className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 bg-gray-100'
              />
              <div className='flex-1'>
                <div className='flex items-center justify-between mb-1'>
                  <p className='font-semibold text-[#00BFFF]'>
                    {reviewer?.fullName || 'Anonymous'}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex gap-1 text-gray-400 text-lg mb-1'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={`${reviewKey}-star-${i}`}>
                      {i < review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className='text-sm text-gray-700 mt-1'>
                  {review.comment || (
                    <span className='italic text-gray-400'>
                      No comment provided.
                    </span>
                  )}
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
