import React, { useState } from "react";
import axios from "axios";

const ResultPage = () => {
  const categories = ["PSG", "Non-PSG"];
  const positions = ["Winner", "Runner-up"];

  const [formData, setFormData] = useState(
    categories.reduce((acc, category) => {
      acc[category] = positions.map((position) => ({
        position,
        name: "",
        teamSize: 1,
        kriyaIds: [""],
        bankDetails: {
          accountHolder: "",
          accountNumber: "",
          ifscCode: "",
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

  const handleFileUpload = (category, index, file) => {
    console.log("Selected file:", file);
    const updatedCategory = [...formData[category]];
    updatedCategory[index].bankDetails.passbookImage = file;
    setFormData({ ...formData, [category]: updatedCategory });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submission:", formData);

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([category, participants]) => {
      participants.forEach((participant, index) => {
        Object.entries(participant).forEach(([key, value]) => {
          if (key === "bankDetails") {
            Object.entries(value).forEach(([bankKey, bankValue]) => {
              if (bankKey === "passbookImage" && bankValue) {
                formDataToSend.append(
                  `formData[${category}][${index}][bankDetails][${bankKey}]`,
                  bankValue
                );
              } else {
                formDataToSend.append(
                  `formData[${category}][${index}][bankDetails][${bankKey}]`,
                  bankValue
                );
              }
            });
          } else if (key === "kriyaIds") {
            value.forEach((id, kriyaIndex) => {
              formDataToSend.append(
                `formData[${category}][${index}][kriyaIds][${kriyaIndex}]`,
                id
              );
            });
          } else {
            formDataToSend.append(
              `formData[${category}][${index}][${key}]`,
              value
            );
          }
        });
      });
    });

    try {
      const result = await axios.post("http://localhost:3000/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto font-poppins flex flex-col justify-center items-center pb-16 px-4 bg-gray-100">
      <h1 className="text-5xl font-bold text-sky-900 mb-10">RESULT</h1>
      <form
        className="flex flex-col h-full w-full max-w-4xl p-8 "
        onSubmit={handleSubmit}
      >
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
                <label className="text-lg font-medium">* Name</label>
                <input
                  required
                  type="text"
                  className="rounded p-2 border border-gray-300 w-full mb-3"
                  value={participant.name}
                  onChange={(e) =>
                    handleChange(category, index, "name", e.target.value)
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
                  * Account Holder’s Name
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

                <label className="text-lg font-medium">
                  * Upload Passbook Image
                </label>
                <input
                  required
                  type="file"
                  className="rounded p-2 border border-gray-300 w-full mb-3"
                  onChange={(e) =>
                    handleFileUpload(category, index, e.target.files[0])
                  }
                />
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="bg-sky-900 text-white p-3 rounded-lg text-lg font-medium hover:bg-sky-700 transition duration-300">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResultPage;
