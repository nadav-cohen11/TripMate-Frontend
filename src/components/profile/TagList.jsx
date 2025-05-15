import React from 'react';

const TagList = ({ items, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className={`${colorClasses[color]} px-3 py-1 rounded-full`}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default TagList; 