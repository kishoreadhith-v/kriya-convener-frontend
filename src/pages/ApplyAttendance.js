import React, { useState } from "react";
import OtpInput from "react-otp-input";
import {
  fetchApplyAttendanceIndividual,
  fetchParticipantDetails,
  fetchApplyAttendanceIndividualWorkshop,
  fetchApplyAttendanceIndividualPaper
} from "../API/calls";
import { toast } from "react-hot-toast";
import KriyaInput from "../components/KriyaInput";
import Row from "../components/Row";
import Button from "../components/Button";

const ApplyAttendance = () => {
  const [kriyaId, setKriyaId] = useState("");

  const [userData, setUserData] = useState(null);

  const handleChange = (val) => {
    setKriyaId(val);
    if (val.length >= 4) {
      setTimeout(() => {
        toast.promise(fetchParticipantDetails(`KRIYA${val}`), {
          loading: "Loading...",
          success: (data) => {
            console.log(data);
            setUserData(data.data.user);
            return "Success";
          },
          error: (err) => {
            setKriyaId("");
            console.log(err);
            return "Error";
          },
        });
      }, 100);
    }
  };

  const handleApply = () => {
    if(localStorage.getItem("user").charAt(0)==="E")
    {
      toast.promise(
        fetchApplyAttendanceIndividual({
          kriyaId,
          eventId: localStorage.getItem("user"),
        }),
        {
          loading: "Loading...",
          success: (data) => {
            setKriyaId("");
            return "Applied Successfully!";
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
      toast.promise(
        fetchApplyAttendanceIndividualPaper({
          kriyaId,
          eventId: localStorage.getItem("user"),
        }),
        {
          loading: "Loading...",
          success: (data) => {
            setKriyaId("");
            return "Applied Successfully!";
          },
          error: (err) => {
            console.log(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
    }
    else{
      toast.promise(
        fetchApplyAttendanceIndividualWorkshop({
          kriyaId,
          eventId: localStorage.getItem("user"),
        }),
        {
          loading: "Loading...",
          success: (data) => {
            setKriyaId("");
            return "Applied Successfully!";
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
    <div className="h-full w-full overflow-y-auto font-poppins  pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">
        Apply for Attendance
      </h1>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 h-fit ">
        <div className="w-full lg:w-fit h-fit">
          <p className="text-lg">Enter Kriya Id</p>
          <KriyaInput value={kriyaId} handleChange={handleChange} />
          <div className="mt-8 flex items-center space-x-4">
            <Button
              disabled={userData ? !userData.isPaid : true}
              text={"Apply"}
              handleClick={handleApply}
            />
            <Button
              handleClick={(e) => {
                e.preventDefault();
                setKriyaId("");
                setUserData(null);
              }}
              outlined
              text="Clear"
            />
          </div>
        </div>
        {userData ? (
          <div className="space-y-4">
            {userData.isPaid ? (
              <div className="text-emerald-600 font-semibold text-3xl">
                Paid!
              </div>
            ) : (
              <div className="text-red-600 font-semibold text-3xl">
                Not Paid!
              </div>
            )}
            <div className="flex items-center">
              <p className="font-semibold w-[10ch]">Name</p>
              <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch]">
                {userData.name}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold w-[10ch]">Email</p>
              <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch]">
                {userData.email}
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold w-[10ch]">College</p>
              <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch] lg:[inline-size:30ch]">
                {userData.college}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-200 h-full p-8 flex justify-center items-center mt-4">
            <p className="text-gray-400 text-2xl font-bold">
              No Data Available!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyAttendance;
