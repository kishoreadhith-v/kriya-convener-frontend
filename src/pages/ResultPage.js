import React, { useState } from "react";
import { submitWinnerDetails, uploadPdf } from "../API/calls";

const ResultPage = () => {
  const categories = ["PSG", "NON-PSG"];
  const positions = ["winner", "runner"];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventId, setEventId] = useState("");

  // Track which PSG positions are enabled
  const [psgEnabled, setPsgEnabled] = useState({
    winner: false,
    runner: false,
  });

  const initialFormState = categories.reduce((acc, category) => {
    acc[category] = positions.map((position) => ({
      position,
      teamSize: 1,
      kriyaIds: [""],
      bankDetails: {
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        phoneNumber: "",
        passbookImage: null,
      },
    }));
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);

  const handlePsgToggle = (position) => {
    setPsgEnabled((prev) => ({
      ...prev,
      [position]: !prev[position],
    }));
  };

  const handleChange = (category, index, field, value) => {
    const updatedCategory = [...formData[category]];
    updatedCategory[index][field] = value;

    if (field === "teamSize") {
      updatedCategory[index].kriyaIds = Array.from({ length: value }, () => "");
    }

    setFormData({ ...formData, [category]: updatedCategory });
  };

  const handleKriyaIdChange = (category, index, kriyaIndex, value) => {
    const updatedCategory = [...formData[category]];
    updatedCategory[index].kriyaIds[kriyaIndex] = value;
    setFormData({ ...formData, [category]: updatedCategory });
  };

  const handleBankDetailChange = (category, index, field, value) => {
    const updatedCategory = [...formData[category]];
    updatedCategory[index].bankDetails[field] = value;
    setFormData({ ...formData, [category]: updatedCategory });
  };

  const handleFileUpload = async (category, index, file, kriyaId) => {
    console.log("Uploading file for Kriya ID:", kriyaId);

    try {
      const response = await uploadPdf(file, kriyaId);
      const imageUrl = response.data.name;

      if (imageUrl) {
        const updatedCategory = [...formData[category]];
        updatedCategory[index].bankDetails.passbookImage = imageUrl;
        setFormData({ ...formData, [category]: updatedCategory });
        console.log("File uploaded successfully:", imageUrl);
      } else {
        console.error("No URL returned from upload API");
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the file. Check console for details.");
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const makeApiCall = async (formattedData, category, position) => {
    try {
      const formDataObj = {};
      for (let [key, value] of formattedData.entries()) {
        formDataObj[key] = value;
      }

      console.log("FormData contents:", formDataObj);
      console.log(`Submitting data for ${category} ${position}`);

      const result = await submitWinnerDetails(formDataObj);
      console.log(`Server response for ${category} ${position}:`, result);

      return result;
    } catch (error) {
      console.error(
        `Error submitting data for ${category} ${position}:`,
        error
      );
      throw error;
    }
  };

  const handleConfirm = async () => {
    console.log("Form Data before submission:", formData);
    console.log("Event ID:", eventId);

    try {
      // Process each category separately
      for (const category of categories) {
        // For PSG category, only process enabled positions
        if (category === "PSG") {
          for (const participant of formData[category]) {
            // Skip if this position is not enabled
            if (!psgEnabled[participant.position]) {
              console.log(`Skipping PSG ${participant.position} - not enabled`);
              continue;
            }

            // Process enabled PSG positions
            await processParticipant(category, participant);
          }
        } else {
          // Process all NON-PSG participants
          for (const participant of formData[category]) {
            await processParticipant(category, participant);
          }
        }
      }

      setShowConfirmation(false);
      alert("All submissions completed successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowConfirmation(false);
      alert("Error submitting form. Please check console for details.");
    }
  };

  // Helper function to process a participant
  const processParticipant = async (category, participant) => {
    const formattedData = new FormData();
    console.log("Processing participant:", participant);

    formattedData.append("eventId", eventId);
    formattedData.append("teamName", participant.teamName);
    formattedData.append("teamSize", participant.teamSize);
    console.log("idsss", participant.kriyaIds);

    formattedData.append("teamMembers", participant.kriyaIds);
    console.log("memem", formattedData.get("teamMembers"));

    formattedData.append("teamPosition", participant.position.toLowerCase());
    formattedData.append("teamAwardCategory", category);

    formattedData.append(
      "beneficiaryAccountName",
      participant.bankDetails.accountHolder
    );
    formattedData.append(
      "beneficiaryAccountNumber",
      participant.bankDetails.accountNumber
    );
    formattedData.append(
      "beneficiaryIFSCCode",
      participant.bankDetails.ifscCode
    );
    formattedData.append(
      "beneficiaryPhoneNumber",
      participant.bankDetails.phoneNumber
    );

    if (participant.bankDetails.passbookImage) {
      formattedData.append(
        "beneficiaryPassbookImage",
        participant.bankDetails.passbookImage
      );
    }

    return makeApiCall(formattedData, category, participant.position);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Helper to determine if a form field is required
  const isRequired = (category, position) => {
    if (category === "NON-PSG") return true;
    return psgEnabled[position];
  };

  // Helper to render participant form
  const renderParticipantForm = (category, participant, index) => {
    // Skip rendering PSG sections that are not enabled
    if (category === "PSG" && !psgEnabled[participant.position]) {
      return null;
    }

    return (
      <div
        key={index}
        className="flex flex-col w-full p-6 mb-6 bg-gray-50 rounded-lg shadow-md"
      >
        <h3 className="font-semibold text-2xl text-sky-900 mb-4">
          {participant.position}
        </h3>
        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Team Name
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="text"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.teamName}
          onChange={(e) =>
            handleChange(category, index, "teamName", e.target.value)
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Team Size
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="number"
          min="1"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.teamSize}
          onChange={(e) =>
            handleChange(category, index, "teamSize", parseInt(e.target.value))
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Kriya IDs
        </label>
        {participant.kriyaIds.map((id, kriyaIndex) => (
          <input
            required={isRequired(category, participant.position)}
            key={kriyaIndex}
            type="text"
            className="rounded p-2 border border-gray-300 w-full mb-3"
            placeholder={`Kriya ID ${kriyaIndex + 1}`}
            value={id}
            onChange={(e) =>
              handleKriyaIdChange(category, index, kriyaIndex, e.target.value)
            }
          />
        ))}

        <h3 className="font-semibold text-xl text-sky-900 mt-4 mb-3">
          Bank Details
        </h3>
        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Account
          Holder's Name
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="text"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.bankDetails.accountHolder}
          onChange={(e) =>
            handleBankDetailChange(
              category,
              index,
              "accountHolder",
              e.target.value
            )
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Account Number
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="text"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.bankDetails.accountNumber}
          onChange={(e) =>
            handleBankDetailChange(
              category,
              index,
              "accountNumber",
              e.target.value
            )
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}IFSC Code
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="text"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.bankDetails.ifscCode}
          onChange={(e) =>
            handleBankDetailChange(category, index, "ifscCode", e.target.value)
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Phone Number
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="tel"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          value={participant.bankDetails.phoneNumber}
          onChange={(e) =>
            handleBankDetailChange(
              category,
              index,
              "phoneNumber",
              e.target.value
            )
          }
        />

        <label className="text-lg font-medium">
          {isRequired(category, participant.position) ? "* " : ""}Upload
          Passbook Image
        </label>
        <input
          required={isRequired(category, participant.position)}
          type="file"
          className="rounded p-2 border border-gray-300 w-full mb-3"
          onChange={(e) =>
            handleFileUpload(
              category,
              index,
              e.target.files[0],
              participant.kriyaIds[0]
            )
          }
        />
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto font-poppins flex flex-col justify-center items-center pb-16 px-4 bg-gray-100">
      <h1 className="text-5xl font-bold text-sky-900 mb-10">RESULT</h1>
      <form
        className="flex flex-col h-full w-full max-w-4xl p-8 "
        onSubmit={handlePreSubmit}
      >
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <label className="text-lg font-medium">* Event ID</label>
          <input
            required
            type="text"
            className="rounded p-2 border border-gray-300 w-full mb-3"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter the Event ID"
          />
          <p className="text-sm text-gray-600">
            This Event ID will be applied to all entries
          </p>
        </div>

        {/* NON-PSG Category (required by default) */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-sky-900 mb-6">
            NON-PSG Category
          </h2>
          {formData["NON-PSG"].map((participant, index) =>
            renderParticipantForm("NON-PSG", participant, index)
          )}
        </div>

        {/* PSG Category with checkboxes */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-sky-900 mb-6">PSG Category</h2>
          <div className="flex flex-col w-full p-6 mb-6 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">
              Please select which positions to include for PSG category:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={psgEnabled.winner}
                  onChange={() => handlePsgToggle("winner")}
                  className="w-5 h-5"
                />
                <span className="text-lg">Include Winner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={psgEnabled.runner}
                  onChange={() => handlePsgToggle("runner")}
                  className="w-5 h-5"
                />
                <span className="text-lg">Include Runner-up</span>
              </label>
            </div>
          </div>

          {formData["PSG"].map((participant, index) =>
            renderParticipantForm("PSG", participant, index)
          )}
        </div>

        <button
          type="submit"
          className="bg-sky-900 text-white p-3 rounded-lg text-lg font-medium hover:bg-sky-700 transition duration-300"
        >
          Submit
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-sky-900 mb-4">
              Confirm Submission
            </h2>
            <p className="mb-6">
              Are you sure you want to submit this form? Please ensure all
              details are correct.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-sky-900 text-white rounded hover:bg-sky-700 transition duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
