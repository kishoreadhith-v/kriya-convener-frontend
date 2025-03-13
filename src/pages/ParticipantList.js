import React, { useEffect, useState } from "react";
import { fetchParticipantDetailsForevent, getEventCount } from "../API/calls";
import { get } from "mongoose";

const ParticipantList = ({ eid }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [participants, setParticipants] = useState([]);

  const [count, setCount] = useState();

  // const participants = [
  //   {
  //     kriyaId: "KRIYA-101",
  //     name: "Arun Kumar",
  //     email: "arun.kumar@example.com",
  //     attended: true,
  //   },
  //   {
  //     kriyaId: "KRIYA-102",
  //     name: "Meera S",
  //     email: "meera.s@example.com",
  //     attended: false,
  //   },
  //   {
  //     kriyaId: "KRIYA-103",
  //     name: "Ravi Shankar",
  //     email: "ravi.shankar@example.com",
  //     attended: true,
  //   },
  //   {
  //     kriyaId: "KRIYA-104",
  //     name: "Vikram R",
  //     email: "vikram.r@example.com",
  //     attended: false,
  //   },
  //   {
  //     kriyaId: "KRIYA-105",
  //     name: "Kavitha P",
  //     email: "kavitha.p@example.com",
  //     attended: true,
  //   },
  //   {
  //     kriyaId: "KRIYA-106",
  //     name: "Suresh N",
  //     email: "suresh.n@example.com",
  //     attended: false,
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Event ID:", eid);

        // Fetch participant details
        const participantRes = await fetchParticipantDetailsForevent(eid);
        setParticipants(participantRes.data);

        // Fetch event count
        const countRes = await getEventCount(eid);
        if (countRes) {
          setCount(countRes[0]); // Extracting the first object in the array
        }

        console.log("Participant Count-----:", countRes[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eid]);

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen flex flex-col items-center bg-graadient-to-br from-blue-50 to-blue-100 p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Participant List
      </h1>
      {/* Display Participant Counts */}
      {count && (
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg text-gray-700">
          <p className="text-lg font-semibold">Event Name: {count.eventName}</p>
          <p className="text-lg font-semibold">
            Total Participants: {count.totalParticipants}
          </p>
          <p className="text-lg text-blue-600">
            PSG Participants: {count.psgParticipants}
          </p>
          <p className="text-lg text-red-600">
            Non-PSG Participants: {count.nonPsgParticipants}
          </p>
        </div>
      )}
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-3 w-96 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg overflow-hidden">
        {participants.length === 0 && (
          <p className="text-gray-600 text-center">Loading...</p>
        )}

        {participants && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-4 text-left">Kriya ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Attended</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="p-4 text-gray-700">{participant.kriyaId}</td>
                  <td className="p-4 text-gray-700">{participant.name}</td>
                  <td className="p-4 text-gray-700">{participant.email}</td>
                  <td className="p-4 text-center font-semibold">
                    <span
                      className={
                        participant.isAttended
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {participant.isAttended ? "Attended" : "Missed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default ParticipantList;
