import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { BsListCheck } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { TbAward } from "react-icons/tb";

const PortalWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
      window.location.href = "/login";
    }
    toast.success(`Welcome ${localStorage.getItem("user")}!`);
  }, [location]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 font-poppins ">
      <header className="p-8 h-fit bg-gradient-to-r from-sky-400 to-sky-700 flex space-x-8 items-center px-8 lg:px-[calc(100vw/12)] relative z-40 shadow-xl">
        <img
          src="/assets/Kriya_KLA_Logo_Final.png"
          className="h-12 lg:h-20 opacity-70"
        />
        <div className="">
          <h1 className="text-xl lg:text-3xl font-semibold">
            Convenor's Portal
          </h1>
          <h2 className="text-gray-800">Kriya 2024</h2>
        </div>
      </header>
      <main className=" flex flex-col lg:flex-row lg:pt-8 h-[calc(100vh-7rem)] lg:h-[calc(100vh-12rem)] overflow-hidden lg:px-[calc(100vw/12)] lg:space-x-8">
        <nav className="hidden lg:block bg-gradient-to-br from-sky-400 to-sky-500 h-fit p-8 py-12 w-1/4 rounded-xl shadow-lg relative z-40 space-y-3">
          <h1 className="text-lg text-sky-700 font-semibold opacity-50 pb-4">
            Menu
          </h1>
          <Link
            to="/dashboard/apply-attendance"
            className="flex items-center space-x-4 group"
          >
            <FiUserCheck className="text-xl text-sky-900 group-hover:opacity-70" />
            <p className="text-lg text-sky-900 group-hover:opacity-70">
              Attendance
            </p>
          </Link>
          <Link
            to="/dashboard/list-attendance"
            className="flex items-center space-x-4 group"
          >
            <BsListCheck className="text-xl text-sky-900 group-hover:opacity-70" />
            <p className="text-lg text-sky-900 group-hover:opacity-70">
              Attendees
            </p>
          </Link>
          <Link
            to="/dashboard/list-participants"
            className="flex items-center space-x-4 group"
          >
            <BsListCheck className="text-xl text-sky-900 group-hover:opacity-70" />
            <p className="text-lg text-sky-900 group-hover:opacity-70">
              Participants
            </p>
          </Link>
          {/* <Link
            to="/dashboard/result"
            className="flex items-center space-x-4 group"
          >
            <TbAward className="text-xl text-sky-900 group-hover:opacity-70" />
            <p className="text-lg text-sky-900 group-hover:opacity-70">
              Results
            </p>
          </Link> */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="flex items-center space-x-4 group"
          >
            <BiLogOutCircle className="text-xl text-sky-900 group-hover:opacity-70" />
            <p className="text-lg text-sky-900 group-hover:opacity-70">
              Logout
            </p>
          </button>
        </nav>
        <div className="flex-1  overflow-auto py-8 lg:p-0">
          <Outlet />
        </div>
        <nav className="h-20 bg-gray-800 w-full lg:hidden flex items-center justify-evenly">
    
        <Link to="/dashboard/apply-attendance">
            <FiUserCheck className="text-4xl text-gray-100" />
          </Link>
          <Link to="/dashboard/list-attendance">
            <BsListCheck className="text-4xl text-gray-100" />
          </Link>
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <BiLogOutCircle className="text-4xl text-gray-100" />
          </button>
        </nav>
      </main>
    </div>
  );
};

export default PortalWrapper;
