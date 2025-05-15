import React from "react";

const TextInput = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "", 
  error,
  ...props 
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 bg-[#7f99a5a0] text-[#2D4A53] placeholder-[#2D4A53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D4A53] ${
          error ? 'border-2 border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>
      )}
    </div>
  );
};

export default TextInput;
