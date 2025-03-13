import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ParticipantList from "./ParticipantList";
import { getWinnerDetails } from "../API/calls";

const TeamCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [eventId, setEventId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winnerDetails, setWinnerDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWinnerDetails = async (id) => {
    if (!id.trim()) {
      setError("Please enter an Event ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching winner details for event ID:", id);
      const res = await getWinnerDetails(id);
      console.log("Winner details:", res);

      if (res.length > 0) {
        setWinnerDetails(res);
        setCurrentIndex(0);
        setShowDetails(true);
      } else {
        setError("No winner details found for this Event ID");
        setShowDetails(false);
      }
    } catch (err) {
      console.error("Error fetching winner details:", err);
      setError("Failed to fetch winner details. Please try again.");
      setShowDetails(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWinnerDetails(eventId);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNext = () => {
    if (winnerDetails.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % winnerDetails.length);
    }
  };

  const handlePrev = () => {
    if (winnerDetails.length > 1) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + winnerDetails.length) % winnerDetails.length
      );
    }
  };

  // Get current team if available
  const currentTeam =
    winnerDetails.length > 0 ? winnerDetails[currentIndex] : null;

  return (
    <div className="mx-auto w-[90%] bg-white shadow-lg rounded-lg p-6 relative">
      {/* Search Bar */}
      <div className="w-full bg-white rounded-full flex items-center p-3 shadow-md mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white p-3 rounded-full flex items-center justify-center w-12 h-12 transition-colors`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            <FaSearch size={20} />
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading winner details...</p>
        </div>
      )}

      {/* Team Details */}
      {showDetails && currentTeam && !isLoading && (
        <>
          <div className="flex  items-center">
            <h2 className="text-xl font-bold">{currentTeam.teamAwardCategory}</h2>
            <span
              className={`text-white text-2xs px-3 py-1 rounded-full ml-10 ${
                currentTeam.teamPosition.toLowerCase() === "winner"
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {currentTeam.teamPosition.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Event ID: {currentTeam.eventId}
          </p>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold flex items-center">🏆 Team Details</h3>
            <p>Team Size: {currentTeam.teamSize} Members</p>
            <p>Award Category: {currentTeam.teamAwardCategory}</p>
            <h4 className="mt-2 font-medium">👥 Team Members</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentTeam.teamMembers.map((member, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold flex items-center">
              📋 Beneficiary Details
            </h3>
            <p className="font-medium">{currentTeam.beneficiaryAccountName}</p>
            <p className="text-sm text-gray-600">
              Phone: {currentTeam.beneficiaryPhoneNumber}
            </p>
            <div className="mt-2 border rounded-lg p-2 bg-gray-100">
              <p>Account Name: {currentTeam.beneficiaryAccountName}</p>
              <p>Account Number: {currentTeam.beneficiaryAccountNumber}</p>
              <p>IFSC Code: {currentTeam.beneficiaryIFSCCode}</p>
            </div>

            {currentTeam.beneficiaryPassbookImage && (
              <div className="mt-4">
                <h4 className="font-medium">Passbook Image</h4>
                <img
                  src={currentTeam.beneficiaryPassbookImage}
                  alt="Passbook"
                  className="mt-2 max-w-full h-auto rounded-lg border shadow"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Image+Not+Available";
                  }}
                />
              </div>
            )}
          </div>

          {winnerDetails.length > 1 && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
              >
                ⬅️ Back
              </button>
              <div className="text-center text-gray-500">
                {currentIndex + 1} of {winnerDetails.length}
              </div>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
      {/* Participant List (Only shows after search) */}
      <ParticipantList eid={eventId} />
    </div>
  );
};

export default TeamCard;
