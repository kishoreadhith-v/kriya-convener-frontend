import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ParticipantList from "./ParticipantList";

const teams = [
  {
    id: "EVT-2023-001",
    name: "Tech Innovators",
    teamSize: 4,
    awardCategory: "PSG",
    prizeAmount: "₹50,000",
    members: ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson"],
    beneficiary: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
      accountNumber: "XXXX-XXXX-XXXX-1234",
    },
    status: "WINNER",
  },
  {
    id: "EVT-2023-002",
    name: "Code Masters",
    teamSize: 3,
    awardCategory: "XYZ",
    prizeAmount: "₹30,000",
    members: ["Alice Brown", "Bob White", "Charlie Green"],
    beneficiary: {
      name: "Alice Brown",
      email: "alice.brown@example.com",
      phone: "+91 9876543211",
      accountNumber: "XXXX-XXXX-XXXX-5678",
    },
    status: "RUNNER",
  },
];

const TeamCard = () => {
  const [showDetails, setShowDetails] = useState(false); // Controls whether to show details
  const [eventId, setEventId] = useState(""); // Stores the search input
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current team index

  // Handle search button click
  const handleSearch = () => {
    setShowDetails(true); // Always show details after search
  };

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teams.length);
  };

  // Handle previous button click
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + teams.length) % teams.length);
  };

  const team = teams[currentIndex]; // Get the current team

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 relative">
      {/* Search Bar */}
      <div className="w-full bg-white rounded-full flex items-center p-3 shadow-md mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 flex items-center justify-center w-12 h-12"
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Team Details */}
      {showDetails && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{team.name}</h2>
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
              {team.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Event ID: {team.id}</p>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold flex items-center">🏆 Team Details</h3>
            <p>Team Size: {team.teamSize} Members</p>
            <p>Award Category: {team.awardCategory}</p>
            <p className="font-bold">Prize Amount: {team.prizeAmount}</p>
            <h4 className="mt-2 font-medium">👥 Team Members</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {team.members.map((member) => (
                <span key={member} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {member}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold flex items-center">📋 Beneficiary Details</h3>
            <p className="font-medium">{team.beneficiary.name}</p>
            <p className="text-sm text-gray-600">{team.beneficiary.email}</p>
            <p className="text-sm text-gray-600">{team.beneficiary.phone}</p>
            <div className="mt-2 border rounded-lg p-2 bg-gray-100">
              <p>Account Name: {team.beneficiary.name}</p>
              <p>Account Number: {team.beneficiary.accountNumber}</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              disabled={teams.length === 1}
            >
              ⬅️ Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              disabled={teams.length === 1}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
      <ParticipantList/>
    </div>
  );
};

export default TeamCard;