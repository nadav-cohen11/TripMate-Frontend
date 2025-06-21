import React from 'react';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-red-600 text-center px-4'>
      <h1 className='text-3xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='mb-6'>The page you're looking for doesn't exist.</p>
      <a
        href='/home'
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
