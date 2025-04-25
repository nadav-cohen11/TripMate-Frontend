import React from "react";

const LoginButton = ({ children, type = "button", onClick, className = "", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full p-2 rounded-md hover:cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default LoginButton;
