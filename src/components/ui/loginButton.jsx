import React from "react";

const LoginButton = ({ children, type = "button", onClick, className = "", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 px-6 bg-[#2D4A53] text-white font-semibold rounded-xl hover:bg-[#2D4A53] transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default LoginButton;
