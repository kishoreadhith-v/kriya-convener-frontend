import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Layout = ({ title, className, children }) => {
  return (
    <div className="w-full h-full overflow-y-auto px-[calc(100vw/24)] py-16 lg:py-8 font-poppins">
      <div className="flex flex-row mb-12 items-center">
        <Link to="/">
          <IoIosArrowBack className="lg:hidden text-3xl mr-4" />
        </Link>
        <h1 className="text-3xl font-semibold text-gray-700">{title}</h1>
      </div>
      <div className={`w-full ${className}`}>{children}</div>
    </div>
  );
};

export default Layout;
