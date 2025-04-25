import React from 'react'

const loginButton = ({ children, onClick, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-white text-black p-2 rounded-md hover:cursor-pointer ${className} `}
      {...props}
    >
      {children}
    </button>

  )
}

export default loginButton