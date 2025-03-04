import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi";
import {
  fetchAttendanceFalse,
  fetchAttendees,
  fetchAttendeesPaper,
  fetchAttendeesWorkshop,
  fetchAttendanceFalsePaper,
  fetchAttendanceFalseWorkshop,
} from "../API/calls";

const ListAttendance = () => {
  const [data, setData] = useState(null);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchData =
      user.charAt(0) === "E"
        ? fetchAttendees
        : user.charAt(0) === "P"
          ? fetchAttendeesPaper
          : fetchAttendeesWorkshop;

    toast.promise(fetchData(user), {
      loading: "Loading...",
      success: (data) => {
        console.log(data);
        setData(data.data);
        return "Success";
      },
      error: (err) => {
        console.error(err);
        return "Error fetching data";
      },
    });
  }, [user]);

  const handleDelete = (email) => {
    if (!window.confirm("Are you sure you want to delete this attendee?")) {
      return;
    }

    const deleteFunction =
      user.charAt(0) === "E"
        ? fetchAttendanceFalse
        : user.charAt(0) === "P"
          ? fetchAttendanceFalsePaper
          : fetchAttendanceFalseWorkshop;

    toast.promise(
      deleteFunction({ email, eventId: user }),
      {
        loading: "Processing...",
        success: () => {
          setData((prevData) => prevData.filter((item) => item.email !== email));
          return "Deleted Successfully!";
        },
        error: (err) => {
          console.error(err);
          return `Error: ${err.response?.data?.message || "Unknown error"}`;
        },
      }
    );
  };

  return (
    <div className="h-full w-full font-poppins pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">Participants List</h1>
      {!data ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-6 p-3 bg-gray-200 font-semibold text-lg">
            <h1>Kriya ID</h1>
            <h1>Name</h1>
            <h1 className="hidden lg:block">Mobile</h1>
            <h1 className="hidden lg:block">Email</h1>
            {/* <h1>Action</h1> */}
          </div>
          <div className="mt-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
            {data.map((item) => (
              <div
                key={item.email}
                className="grid grid-cols-5 gap-6 p-3 border-b border-gray-300 items-center"
              >
                <p>{item.kriyaId}</p>
                <p>{item.name}</p>
                <p className="hidden lg:block">{item.phone}</p>
                <p className="hidden lg:block">{item.email}</p>
                {/* <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.email)}
                >
                  <HiOutlineTrash size={20} />
                </button> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAttendance;
