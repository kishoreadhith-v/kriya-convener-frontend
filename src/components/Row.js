import React from "react";

const Row = ({ children, className="" }) => {
  return <div className={`${className} flex items-start space-y-4 lg:space-y-0 lg:space-x-4 flex-col lg:flex-row`}>{children}</div>;
};

export default Row;
