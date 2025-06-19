import React from 'react';

export const Spinner = ({ size = 40, color = 'text-[#4a90e2]', speed = 'animate-spin' }) => {
  return (
    <div className="flex justify-center items-center z-40">
      <svg
        className={`${speed}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-label="Loading spinner"
        role="img"
      >
        <circle
          className="opacity-25"
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
        ></circle>
        <path
          className={`${color} opacity-75`}
          fill="currentColor"
          d="M50 15a35 35 0 0135 35h-7a28 28 0 10-56 0h-7a35 35 0 0135-35z"
        ></path>
      </svg>
    </div>
  );
};
