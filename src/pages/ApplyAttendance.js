import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import {
  fetchApplyAttendanceIndividual,
  fetchParticipantDetails,
  fetchApplyAttendanceIndividualWorkshop,
  fetchApplyAttendanceIndividualPaper,
  fetchUserPaymentDetails
} from "../API/calls";
import { toast } from "react-hot-toast";
import KriyaInput from "../components/KriyaInput";
import Row from "../components/Row";
import Button from "../components/Button";
import axios from "axios"; // Assuming axios is used for API calls

const ApplyAttendance = () => {
  const [kriyaId, setKriyaId] = useState("");
  const [userData, setUserData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [psgTeams, setPsgTeams] = useState("");
  const [nonPsgTeams, setNonPsgTeams] = useState("");
  const [showTeamInputs, setShowTeamInputs] = useState(false);

  const currentUser = localStorage.getItem("user");

  // Fetch team data when component mounts
  useEffect(() => {
    if (currentUser && currentUser.charAt(0) === "E") {
      fetchTeamData();
    }
  }, [currentUser]);

  const fetchTeamData = async () => {
    try {
      const response = await axios.get(`https://kriyaconvenordb.psgtech.ac.in/event-teams/${currentUser}`);
      setTeamData(response.data);

      // Check if both team counts are null and show input fields if needed
      if (response.data.NoOfPSGteams === null && response.data.NoOfNONPSGteams === null) {
        setShowTeamInputs(true);
      } else {
        setShowTeamInputs(false);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleUpdateTeamCounts = async () => {
    try {
      const response = await axios.put(`https://kriyaconvenordb.psgtech.ac.in/event-teams/update/${currentUser}`, {
        NoOfPSGteams: parseInt(psgTeams),
        NoOfNONPSGteams: parseInt(nonPsgTeams)
      });

      toast.success("Team counts updated successfully!");
      setTeamData(response.data.data);
      setShowTeamInputs(false);
    } catch (error) {
      toast.error(`Error updating team counts: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleChange = (val) => {
    setKriyaId(val);
    if (val.length >= 4) {
      setTimeout(() => {
        const currentUser = localStorage.getItem("user");

        // Special handling for workshop users
        if (currentUser.charAt(0) === "W") {
          console.log(`KRIYA${val}`, currentUser);
          toast.promise(fetchUserPaymentDetails(`KRIYA${val}`, currentUser), {
            loading: "Loading workshop participant details...",
            success: (data) => {
              console.log("Workshop user data:", data.data.user);
              setUserData(data.data.user);
              return "Workshop participant details loaded successfully";
            },
            error: (err) => {
              setKriyaId("");
              console.log("Error fetching workshop user:", err);
              return "Error fetching workshop participant details";
            },
          });

        } else {
          // Regular participant details fetching for non-workshop users
          toast.promise(fetchParticipantDetails(`KRIYA${val}`), {
            loading: "Loading participant details...",
            success: (data) => {
              console.log("Regular participant data:", data);
              setUserData(data.data.user);
              return "Participant details loaded successfully";
            },
            error: (err) => {
              setKriyaId("");
              console.log("Error fetching participant:", err);
              return "Error fetching participant details";
            },
          });
        }
      }, 100);
    }
  };

  const handleApply = () => {
    const currentUser = localStorage.getItem("user");

    if (currentUser.charAt(0) === "E") {
      toast.promise(
        fetchApplyAttendanceIndividual({
          kriyaId,
          eventId: currentUser,
        }),
        {
          loading: "Applying attendance...",
          success: (data) => {
            setKriyaId("");
            setUserData(null);
            return "Applied Successfully!";
          },
          error: (err) => {
            console.log(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
    } else if (currentUser.charAt(0) === "P") {
      toast.promise(
        fetchApplyAttendanceIndividualPaper({
          kriyaId,
          eventId: currentUser,
        }),
        {
          loading: "Applying paper attendance...",
          success: (data) => {
            setKriyaId("");
            setUserData(null);
            return "Applied Successfully!";
          },
          error: (err) => {
            console.log(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
    } else if (currentUser.charAt(0) === "W") {
      toast.promise(
        fetchApplyAttendanceIndividualWorkshop({
          kriyaId,
          eventId: currentUser,
        }),
        {
          loading: "Applying workshop attendance...",
          success: (data) => {
            setKriyaId("");
            setUserData(null);
            return "Workshop attendance applied successfully!";
          },
          error: (err) => {
            console.log(err);
            return `Error: ${err.response.data.message}`;
          },
        }
      );
    }
  };

  // Determine if the user is a workshop participant
  const isWorkshopUser = currentUser?.charAt(0) === "W";
  const isEventUser = currentUser?.charAt(0) === "E";

  return (
    <div className="h-full w-full overflow-y-auto font-poppins pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">
        Apply for Attendance
      </h1>

      {/* Team Count Input Section (Only for Event organizers when both counts are null) */}

      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 h-fit">
        <div className="w-full lg:w-fit h-fit">
          <p className="text-lg">Enter Kriya Id</p>
          <KriyaInput value={kriyaId} handleChange={handleChange} />
          <div className="mt-8 flex items-center space-x-4">
            <Button
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
            {/* Payment status logic - different for workshop users */}
            {isWorkshopUser ? (
              // For workshop users, use the paymentStatus field
              userData.paymentStatus
                ? (
                  <div className="text-emerald-600 font-semibold text-3xl">
                    Paid!
                  </div>
                ) : (
                  <div className="text-red-600 font-semibold text-3xl">
                    Not Paid!
                  </div>
                )
            ) : (
              // For non-workshop users, use the isPaid field
              userData.isPaid ? (
                <div className="text-emerald-600 font-semibold text-3xl">
                  Paid!
                </div>
              ) : (
                <div className="text-red-600 font-semibold text-3xl">
                  Not Paid!
                </div>
              )
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
      {isEventUser && showTeamInputs && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold text-sky-900 mb-4">Event Team Configuration</h2>
          <p className="text-gray-700 mb-4">
            Please enter the number of PSG and non-PSG teams for this event.
            <span className="font-semibold text-red-500"> Note: This can only be set once.</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg mb-2">Number of PSG Teams</label>
              <input
                type="number"
                value={psgTeams}
                onChange={(e) => setPsgTeams(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter number"
                min="0"
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Number of Non-PSG Teams</label>
              <input
                type="number"
                value={nonPsgTeams}
                onChange={(e) => setNonPsgTeams(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter number"
                min="0"
              />
            </div>
          </div>
          <Button
            text="Save Team Counts"
            handleClick={handleUpdateTeamCounts}
            className="mt-4"
          />
        </div>
      )}

      {/* Team Count Display Section (When counts are already set) */}
      {isEventUser && teamData && !showTeamInputs && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold text-sky-900 mb-4">Event Team Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-medium">PSG Teams</p>
              <p className="text-3xl font-bold text-sky-700">{teamData.NoOfPSGteams}</p>
            </div>
            <div>
              <p className="text-lg font-medium">Non-PSG Teams</p>
              <p className="text-3xl font-bold text-sky-700">{teamData.NoOfNONPSGteams}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplyAttendance;