import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import {
  fetchAttendanceFalse,
  fetchAttendees,
  fetchAttendeesPaper,
  fetchAttendeesWorkshop,
  fetchAttendanceFalsePaper,
  fetchAttendanceFalseWorkshop,
  fetchListAttendanceIndividual,
  fetchParticipantDetails,
} from "../API/calls";
import { toast } from "react-hot-toast";
import KriyaInput from "../components/KriyaInput";
import Row from "../components/Row";
import Button from "../components/Button";
import { HiOutlineTrash } from "react-icons/hi";

const ListAttendance = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if(localStorage.getItem("user").charAt(0)==="E")
    {
      toast.promise(fetchAttendees(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          console.log(data.data);
          setData(data.data);
          return "Success";
        },
        error: (err) => {
          console.log(err);
          return "Error";
        },
      });
    }
    else if(localStorage.getItem("user").charAt(0)==="P")
    {
      toast.promise(fetchAttendeesPaper(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          console.log(data.data);
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
      toast.promise(fetchAttendeesWorkshop(localStorage.getItem("user")), {
        loading: "Loading...",
        success: (data) => {
          console.log(data.data);
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
    if(localStorage.getItem("user").charAt(0)==="E")
    {
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
    }
    else if(localStorage.getItem("user").charAt(0)==="P")
    {
      window.confirm("Are you sure you want to delete this attendee?") &&
      toast.promise(
        fetchAttendanceFalsePaper({
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
    }
    else{
      window.confirm("Are you sure you want to delete this attendee?") &&
      toast.promise(
        fetchAttendanceFalseWorkshop({
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
    }
  };

  return (
    <div className="h-full w-full overflow-hidden font-poppins  pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">
        Attendees List
      </h1>
      {!data ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <React.Fragment>
          <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] h-[calc(100vh-)]">
            <h1 className="text-lg font-semibold">Kriya ID</h1>
            <h1 className="text-lg font-semibold">Name</h1>
            <h1 className="hidden lg:block text-lg font-semibold">Mobile</h1>
            <h1 className={"hidden lg:block text-lg font-semibold"+localStorage.getItem("user").charAt(0)==="P"?" text-white":" "}>Time</h1>
          </div>
          <div className="mt-2 gap-1 grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] max-h-[calc(100vh-20rem)] overflow-y-auto">
            {data.map((item) => (
              <React.Fragment>
                <p className="h-fit ">{item.kriyaId}</p>
                <p className="h-fit ">{item.name}</p>
                <p className="h-fit hidden lg:block">{item.phone}</p>
                <p className={"h-fit hidden lg:block"+localStorage.getItem("user").charAt(0)==="P"?" text-white":" "}>
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

export default ListAttendance;
