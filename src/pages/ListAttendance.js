import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { fetchAttendees, fetchAttendeesPaper, fetchAttendeesWorkshop } from "../API/calls";

const ListAttendance = () => {
  const [data, setData] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchData =
      user.charAt(0) === "E"
        ? fetchAttendees
        : user.charAt(0) === "P"
          ? fetchAttendeesPaper
          : fetchAttendeesWorkshop;

    toast.promise(
      fetchData(user).then((res) => {
        setData(res.data);
        return "Success";
      }),
      {
        loading: "Loading...",
        success: "Data loaded successfully!",
        error: "Error fetching data",
      }
    );
  }, [user]);

  // ✅ Toggle Checkbox Selection
  const handleCheckboxChange = (participant) => {
    setSelectedParticipants((prev) =>
      prev.includes(participant.email)
        ? prev.filter((email) => email !== participant.email)
        : [...prev, participant.email]
    );
  };

  // ✅ Promote Selected Participants
  const handlePromoteClick = async () => {
    if (selectedParticipants.length === 0) {
      alert("Please select at least one participant.");
      return;
    }

    const eventId = localStorage.getItem("user");
    console.log("Promoting selected participants:", selectedParticipants);
    console.log("Event ID:", eventId);
    let round = data.find((p) => p.email === selectedParticipants[0]).roundLevel + 1;
    try {
      const response = await axios.post(
        "https://kriyaconvenordb.psgtech.ac.in/update-round-userlist",
        {
          eventId,
          emailList: selectedParticipants, // ✅ Send only emails
          round: round
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      toast.success("Selected participants promoted successfully!");

      // ✅ Update UI with incremented round levels
      setData((prevData) =>
        prevData.map((p) =>
          selectedParticipants.includes(p.email)
            ? { ...p, roundLevel: p.roundLevel + 1 }
            : p
        )
      );

      setSelectedParticipants([]); // ✅ Reset selection after promotion
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error updating event details");
    }
  };

  return (
    <div className="h-full w-full font-poppins pb-16 px-4">
      <h1 className="text-4xl font-semibold text-sky-900 mb-8">Participants List</h1>

      {!data.length ? (
        <h1 className="text-3xl font-semibold">Loading...</h1>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[50px_150px_200px_150px_250px_150px] gap-4 p-3 bg-gray-200 font-semibold text-lg">
              <input type="checkbox" disabled className="opacity-0" />
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
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(item.email)}
                    onChange={() => handleCheckboxChange(item)}
                  />
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

      {/* ✅ Promote Selected Button */}
      {selectedParticipants.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handlePromoteClick}
          >
            Promote Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default ListAttendance;
