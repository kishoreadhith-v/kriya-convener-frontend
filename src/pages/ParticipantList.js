import React, { useState } from "react";

const ParticipantList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const participants = [
    { kriyaId: "KRIYA-101", name: "Arun Kumar", email: "arun.kumar@example.com", attended: true },
    { kriyaId: "KRIYA-102", name: "Meera S", email: "meera.s@example.com", attended: false },
    { kriyaId: "KRIYA-103", name: "Ravi Shankar", email: "ravi.shankar@example.com", attended: true },
    { kriyaId: "KRIYA-104", name: "Vikram R", email: "vikram.r@example.com", attended: false },
    { kriyaId: "KRIYA-105", name: "Kavitha P", email: "kavitha.p@example.com", attended: true },
    { kriyaId: "KRIYA-106", name: "Suresh N", email: "suresh.n@example.com", attended: false },
  ];

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen flex flex-col items-center bg-graadient-to-br from-blue-50 to-blue-100 p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Participant List</h1>

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
              <tr key={index} className="border-t border-gray-200 hover:bg-blue-50 transition">
                <td className="p-4 text-gray-700">{participant.kriyaId}</td>
                <td className="p-4 text-gray-700">{participant.name}</td>
                <td className="p-4 text-gray-700">{participant.email}</td>
                <td className="p-4 text-center font-semibold">
                  <span className={
                    participant.attended ? "text-green-600" : "text-red-600"
                  }>
                    {participant.attended ? "Attended" : "Missed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ParticipantList;
