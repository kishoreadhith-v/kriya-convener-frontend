import React, { useState } from "react";
import { submitWinnerDetails, uploadPdf } from "../API/calls";

const ResultPage = () => {
  const categories = ["PSG", "NON-PSG"];
  const positions = ["winner", "runner"];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventId, setEventId] = useState("");

  const [formData, setFormData] = useState(
    categories.reduce((acc, category) => {
      acc[category] = positions.map((position) => ({
        position,
        teamName: "",
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
    }, {})
  );

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
      const imageUrl = response.data.name; // Assuming backend returns { fileUrl: "uploaded_url" }

      if (imageUrl) {
        const updatedCategory = [...formData[category]];
        updatedCategory[index].bankDetails.passbookImage = imageUrl; // Store the URL instead of the file
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

  // Helper function to display FormData contents
  // const logFormData = (formData) => {
  //   const formDataObj = {};
  //   for (let [key, value] of formData.entries()) {
  //     formDataObj[key] = value;
  //   }
  //   console.log("FormData contents:", formDataObj);
  // };

  // Helper function to make API call
  const makeApiCall = async (formattedData, category, position) => {
    try {
      // Log FormData before submission
      // logFormData(formattedData);
      const formDataObj = {};
      for (let [key, value] of formattedData.entries()) {
        formDataObj[key] = value;
      }

      console.log("FormData contents1234:", formDataObj);

      console.log(`Submitting data for ${category} ${position}`);

      // Send the request for this participant
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
        // Process each participant (Winner/Runner-up) in the category
        for (const participant of formData[category]) {
          // Convert participant data to the required format
          const formattedData = new FormData();
          console.log("Processing participant:", participant);

          // Add required fields to the FormData
          formattedData.append("eventId", eventId);
          formattedData.append("teamName", participant.teamName);
          formattedData.append("teamSize", participant.teamSize);
          console.log("idsss", participant.kriyaIds);
          // Create a JSON string of the kriyaIds array
          formattedData.append("teamMembers", participant.kriyaIds);
          console.log("memem", formattedData.get("teamMembers"));

          // Map position to teamPosition (lowercase as specified in the format)
          formattedData.append(
            "teamPosition",
            participant.position.toLowerCase()
          );
          formattedData.append("teamAwardCategory", category);

          // Add bank details
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

          // Add passbook image if available
          if (participant.bankDetails.passbookImage) {
            formattedData.append(
              "beneficiaryPassbookImage",
              participant.bankDetails.passbookImage
            );
          }

          // Make API call for this participant
          await makeApiCall(formattedData, category, participant.position);
        }
      }

      setShowConfirmation(false);
      // Optional: Add success notification or redirect after successful submission
      alert("All submissions completed successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowConfirmation(false);
      // Optional: Add error notification
      alert("Error submitting form. Please check console for details.");
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
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

        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-3xl font-bold text-sky-900 mb-6">
              {category} Category
            </h2>
            {formData[category].map((participant, index) => (
              <div
                key={index}
                className="flex flex-col w-full p-6 mb-6 bg-gray-50 rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-2xl text-sky-900 mb-4">
                  {participant.position}
                </h3>
                <label className="text-lg font-medium">* Team Name</label>
                <input
                  required
                  type="text"
                  className="rounded p-2 border border-gray-300 w-full mb-3"
                  value={participant.teamName}
                  onChange={(e) =>
                    handleChange(category, index, "teamName", e.target.value)
                  }
                />

                <label className="text-lg font-medium">* Team Size</label>
                <input
                  required
                  type="number"
                  min="1"
                  className="rounded p-2 border border-gray-300 w-full mb-3"
                  value={participant.teamSize}
                  onChange={(e) =>
                    handleChange(
                      category,
                      index,
                      "teamSize",
                      parseInt(e.target.value)
                    )
                  }
                />

                <label className="text-lg font-medium">* Kriya IDs</label>
                {participant.kriyaIds.map((id, kriyaIndex) => (
                  <input
                    required
                    key={kriyaIndex}
                    type="text"
                    className="rounded p-2 border border-gray-300 w-full mb-3"
                    placeholder={`Kriya ID ${kriyaIndex + 1}`}
                    value={id}
                    onChange={(e) =>
                      handleKriyaIdChange(
                        category,
                        index,
                        kriyaIndex,
                        e.target.value
                      )
                    }
                  />
                ))}

                <h3 className="font-semibold text-xl text-sky-900 mt-4 mb-3">
                  Bank Details
                </h3>
                <label className="text-lg font-medium">
                  * Account Holder's Name
                </label>
                <input
                  required
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

                <label className="text-lg font-medium">* Account Number</label>
                <input
                  required
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

                <label className="text-lg font-medium">* IFSC Code</label>
                <input
                  required
                  type="text"
                  className="rounded p-2 border border-gray-300 w-full mb-3"
                  value={participant.bankDetails.ifscCode}
                  onChange={(e) =>
                    handleBankDetailChange(
                      category,
                      index,
                      "ifscCode",
                      e.target.value
                    )
                  }
                />

                <label className="text-lg font-medium">* Phone Number</label>
                <input
                  required
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
                  * Upload Passbook Image
                </label>
                <input
                  required
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
            ))}
          </div>
        ))}
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
