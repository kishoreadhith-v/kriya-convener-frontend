import React, { useEffect, useState } from "react";
import {
  fetchParticipantDetailsForevent,
  getEventCount,
  fetchAttendeesCountForEvent,
  fetchParticipantDetailsForWorkshop,
  fetchParticipantDetailsForPaper,
} from "../API/calls";

const LoadingSkeleton = () => (
  <>
    {/* Card Skeletons */}
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg w-full max-w-4xl animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    {/* Table Skeleton */}
    <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    </div>
  </>
);

const ParticipantList = ({ eid }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState([]);
  const [count, setCount] = useState();
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Event ID:", eid);

        // Determine which fetch function to use based on the first character of eid
        const fetchParticipantDetails =
          eid.charAt(0) === "E"
            ? fetchParticipantDetailsForevent
            : eid.charAt(0) === "W"
            ? fetchParticipantDetailsForWorkshop
            : fetchParticipantDetailsForPaper;

        // Fetch participant details
        const participantRes = await fetchParticipantDetails(eid);
        console.log("Participant details:", participantRes.data);
        setParticipants(participantRes.data);

        // Fetch event count
        const countRes = await getEventCount(eid);
        if (countRes) {
          setCount(countRes[0]); // Extracting the first object in the array
        }

        // Fetch attendee count
        const attendeeRes = await fetchAttendeesCountForEvent(eid);
        console.log("Attendee details:", attendeeRes);
        setAttendeeCount(attendeeRes.data);

        console.log("Participant Count-----:", countRes[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Display Participant Counts */}
          {count && (
            <div className="mb-6 p-4 bg-white shadow-md rounded-lg text-gray-700">
              <p className="text-lg font-semibold">
                Event Name: {count.eventName}
              </p>
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

          {/* Display Attendee Counts */}
          {attendeeCount && (
            <div className="mb-6 p-4 bg-white shadow-md rounded-lg text-gray-700">
              <p className="text-lg font-semibold">Attendance Summary</p>
              <p className="text-lg">
                Total Attendees: {attendeeCount.totalAttendeeCount}
              </p>
              <p className="text-lg text-blue-600">
                PSG Attendees: {attendeeCount.psgStudentCount}
              </p>
              <p className="text-lg text-red-600">
                Non-PSG Attendees: {attendeeCount.nonPsgStudentCount}
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
            {participants.length === 0 ? (
              <p className="text-gray-600 text-center">No participants found</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="p-4 text-left">Kriya ID</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Round Level</th>
                    <th className="p-4 text-center">Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-blue-50 transition"
                    >
                      <td className="p-4 text-gray-700">
                        {participant.kriyaId}
                      </td>
                      <td className="p-4 text-gray-700">{participant.name}</td>
                      <td className="p-4 text-gray-700">{participant.email}</td>
                      <td className="p-4 text-gray-700">
                        {participant.roundLevel}
                      </td>
                      <td className="p-4 text-center font-semibold">
                        <span
                          className={
                            participant.attendedAt !== null
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {participant.attendedAt ? "Attended" : "Missed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default ParticipantList;
