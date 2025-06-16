import React from 'react';

const DatePicker = ({ date, handleInputChange, name }) => {
  return (
    <input
      type="date"
      id={name}
      name={name}
      value={date}
      onChange={handleInputChange}
      min={new Date().toISOString().split('T')[0]}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
    />
  );
};

export default DatePicker; 