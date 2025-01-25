import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import {
  fetchAttendanceFalse,
  fetchAttendees,
  fetchListAttendanceIndividual,
  fetchParticipantDetails,
  fetchParticipantDetailsForevent,
  fetchParticipantDetailsForPaper,
  fetchParticipantDetailsForWorkshop
} from "../API/calls";
import { toast } from "react-hot-toast";
import KriyaInput from "../components/KriyaInput";
import Row from "../components/Row";
import Button from "../components/Button";
import { HiOutlineTrash } from "react-icons/hi";

const ListParticipants = () => {
  const [data, setData] = useState(null);

  useEffect(() => {

    if(localStorage.getItem("user").charAt(0)==="E")
    {
      toast.promise(fetchParticipantDetailsForevent(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          setData(data.data);
          return "Success";
        },
        error: (err) => {
          console.log(err);
          return "Error";
        },
      });
    }
    else if(localStorage.getItem("user").charAt(0)==="W")
      {
      toast.promise(fetchParticipantDetailsForWorkshop(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          setData(data.data);
          return "Success";
        },
        error: (err) => {
          console.log(err);
          return "Error";
        },
      });
    }
    else
    {
      toast.promise(fetchParticipantDetailsForPaper(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          setData(data.data);
          return "Success";
        },
        error: (err) => {
          console.log(err);
          return "Error";
        },
      });
    }
    
  }, []);

  const handleDelete = (email) => {
    window.confirm("Are you sure you want to delete this attendee?") &&
      toast.promise(
        fetchAttendanceFalse({
          email,
          eventId: localStorage.getItem("user"),
        }),
        {
          loading: "Loading...",
          success: (data) => {
            window.location.reload();
            return "Deleted Successfully!";
          },
          error: (err) => {
            console.log(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
  };

  return (
    <div className="h-full w-full font-poppins  pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">
        Participants List
      </h1>
      {!data ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <React.Fragment>
          <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] h-[calc(100vh-)]">
            <h1 className="text-lg font-semibold">Kriya ID</h1>
            <h1 className="text-lg font-semibold">Name</h1>
            <h1 className="hidden lg:block text-lg font-semibold">Mobile</h1>
            <h1 className={"hidden lg:block text-lg font-semibold"}>Time</h1>
          </div>
          <div className="mt-2 gap-1 grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] max-h-[calc(100vh-20rem)] overflow-y-auto">
            {data.map((item) => (
              <React.Fragment>
                <p className="h-fit ">{item.kriyaId}</p>
                <p className="h-fit ">{item.name}</p>
                <p className="h-fit hidden lg:block">{item.phone}</p>
                <p className="h-fit hidden lg:block">
                  {new Date(item.attendedAt).toLocaleString()}
                </p>
                <button
                  className="text-white"
                  onClick={() => {
                    // handleDelete(item.user[0].email);
                  }}
                >
                  <HiOutlineTrash />
                </button>
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ListParticipants;
