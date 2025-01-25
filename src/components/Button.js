import React from "react";

const Button = ({
  handleClick,
  text,
  className,
  outlined = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) handleClick(e);
      }}
      className={`${className} ${
        outlined ? "text-sky-600 bg-white " : "bg-sky-600 text-white"
      } ${disabled && "bg-gray-500 border-gray-500" } border-2  border-sky-600 font-semibold text-lg w-full px-4 py-2 rounded-lg shadow-lg`}
    >
      {text}
    </button>
  );
};

export default Button;
