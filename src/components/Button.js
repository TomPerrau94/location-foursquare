import React from "react";

const Button = ({ label, className, action }) => {
  return (
    <button className={className} onClick={() => action()}>
      {label}
    </button>
  );
};

export default Button;
