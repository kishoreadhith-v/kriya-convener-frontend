import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { fetchAttendees, fetchAttendeesPaper, fetchAttendeesWorkshop } from "../API/calls";

const ListAttendance = () => {
  const [data, setData] = useState([]); // ✅ Initialized as an empty array
  const [selectedParticipant, setSelectedParticipant] = useState(null);
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
        setData(res.data); // ✅ Ensure data is properly set
        return "Success";
      }),
      {
        loading: "Loading...",
        success: "Data loaded successfully!",
        error: "Error fetching data",
      }
    );
  }, [user]);

  // ✅ Handle Promote Click
  const handlePromoteClick = async (participant) => {
    if (!participant.email || !participant.roundLevel) {
      alert("Please enter all required fields");
      return;
    }

    let eventId = localStorage.getItem("user");

    try {
      const response = await axios.post(
        "https://kriyaconvenordb.psgtech.ac.in/update-round-user",
        {
          eventId,
          email: participant.email,
          round: participant.roundLevel + 1, // ✅ Ensure roundLevel is incremented correctly
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response.data);
      toast.success(`Promoted ${participant.kriyaId} to Round ${participant.roundLevel + 1}`);

      // ✅ Update state to reflect promoted participant
      setData((prevData) =>
        prevData.map((p) =>
          p.email === participant.email ? { ...p, roundLevel: p.roundLevel + 1 } : p
        )
      );

      setSelectedParticipant(null); // ✅ Close modal after promotion
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
            <div className="grid grid-cols-[150px_200px_150px_250px_150px_150px] gap-4 p-3 bg-gray-200 font-semibold text-lg">
              <h1 className="text-left">Kriya ID</h1>
              <h1 className="text-left">Name</h1>
              <h1 className="hidden lg:block text-left">Mobile</h1>
              <h1 className="hidden lg:block text-left">Email</h1>
              <h1 className="text-left">Round Level</h1>
              <h1 className="text-left">Promote</h1>
            </div>

            <div className="mt-2 max-h-[calc(100vh-20rem)]">
              {data.map((item) => (
                <div
                  key={item.email}
                  className="grid grid-cols-[150px_200px_150px_250px_150px_150px] gap-4 p-3 border-b border-gray-300 items-center"
                >
                  <p className="truncate">{item.kriyaId}</p>
                  <p className="truncate">{item.name}</p>
                  <p className="hidden lg:block truncate">{item.phone}</p>
                  <p className="hidden lg:block truncate">{item.email}</p>
                  <p className="truncate">{item.roundLevel}</p>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => setSelectedParticipant(item)} // ✅ Opens modal for confirmation
                  >
                    Promote
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Promotion Confirmation Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Confirm promotion for {selectedParticipant.kriyaId}?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handlePromoteClick(selectedParticipant)}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setSelectedParticipant(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAttendance;
