import React from "react";

const LoginButton = ({ children, type = "button", onClick, className = "", bgColor = "#2D4A53", hoverColor = "#2D4A53", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 px-6 text-white font-semibold rounded-xl transition duration-300 ${className}`}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = bgColor}
      {...props}
    >
      {children}
    </button>

  );
};

export default LoginButton;
