import React from "react";

const TextInput = ({ type = "text", placeholder, value, onChange, className = "", ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-transparent border-b border-white text-white placeholder:text-white/90 focus:outline-none focus:border-b-2 ${className}`}
      {...props}
    />
  );
};

export default TextInput;
