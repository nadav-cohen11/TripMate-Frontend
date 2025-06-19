import React from 'react';

export const Spinner = ({ size = 40, color = 'text-blue-500', speed = 'animate-spin' }) => {
  return (
    <svg
      className={`${speed} ${color}`}
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M50 15a35 35 0 0135 35h-7a28 28 0 10-56 0h-7a35 35 0 0135-35z"
      />
    </svg>
  );
};
