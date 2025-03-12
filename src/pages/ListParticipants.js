import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi";
import {
  fetchAttendanceFalse,
  fetchParticipantDetailsForevent,
  fetchParticipantDetailsForPaper,
  fetchParticipantDetailsForWorkshop,
} from "../API/calls";

const ListParticipants = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const fetchData =
      user.charAt(0) === "E"
        ? fetchParticipantDetailsForevent
        : user.charAt(0) === "W"
          ? fetchParticipantDetailsForWorkshop
          : fetchParticipantDetailsForPaper;

    toast.promise(fetchData(user), {
      loading: "Loading...",
      success: (response) => {
        setData(response.data);
        return "Success";
      },
      error: (err) => {
        console.error(err);
        return "Error";
      },
    });
  }, []);

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this attendee?")) {
      toast.promise(
        fetchAttendanceFalse({
          email,
          eventId: localStorage.getItem("user"),
        }),
        {
          loading: "Deleting...",
          success: () => {
            setData(data.filter((item) => item.email !== email));
            return "Deleted Successfully!";
          },
          error: (err) => {
            console.error(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
    }
  };

  return (
    <div className="h-full w-full font-poppins pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">Participants List</h1>
      {!data ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[50px_150px_200px_150px_250px_150px] gap-4 p-3 bg-gray-200 font-semibold text-lg">
              <h1 className="text-left">Kriya ID</h1>
              <h1 className="text-left">Name</h1>
              <h1 className="hidden lg:block text-left">Mobile</h1>
              <h1 className="hidden lg:block text-left">Email</h1>
              <h1 className="text-left">Round Level</h1>
            </div>

            <div className="mt-2 max-h-[calc(100vh-20rem)]">
              {data.map((item) => (
                <div
                  key={item.email}
                  className="grid grid-cols-[50px_150px_200px_150px_250px_150px] gap-4 p-3 border-b border-gray-300 items-center"
                >

                  <p className="truncate">{item.kriyaId}</p>
                  <p className="truncate">{item.name}</p>
                  <p className="hidden lg:block truncate">{item.phone}</p>
                  <p className="hidden lg:block truncate">{item.email}</p>
                  <p className="truncate">{item.roundLevel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListParticipants;
