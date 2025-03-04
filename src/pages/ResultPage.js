import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResultPage = () => {
  const [winnerDetails, setWinnerDetails] = useState([
    { name: '', position: 'Winner', team: '', AccountNumber: '', AccountIFSCcode: '' },
    { name: '', position: 'Runner', team: '', AccountNumber: '', AccountIFSCcode: '' },
  ]);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...winnerDetails];
    updatedDetails[index][field] = value;
    setWinnerDetails(updatedDetails);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      eventID: window.localStorage.getItem('user'),
      winnerDetails,
    };

    try {
      const result = await axios.post('http://localhost:3000', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }

    setWinnerDetails([
      { name: '', position: 'Winner', team: '', AccountNumber: '', AccountIFSCcode: '' },
      { name: '', position: 'Runner', team: '', AccountNumber: '', AccountIFSCcode: '' },
    ]);
  }

  return (
    <div className="h-full w-full overflow-y-auto font-poppins flex flex-col justify-center items-center pb-16 px-4 bg-gray-100">
      <h1 className="text-5xl font-bold text-sky-900 mb-10">RESULT</h1>
      <form
        className="flex flex-col h-full w-full max-w-4xl  p-8  rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full justify-center items-center">
          <h1 className="font-semibold text-3xl text-sky-900 mb-6">Participants</h1>
          {winnerDetails.map((participant, index) => (
            <div key={index} className="flex flex-col w-full p-6 mb-6 bg-gray-50 rounded-lg shadow-md">
              <h1 className="font-semibold text-2xl text-sky-900 mb-4">{participant.position}</h1>
              <label className="text-lg font-medium">*Name</label>
              <input
                type="text"
                className="rounded p-2 border border-gray-300 w-full mb-3"
                value={participant.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
              <label className="text-lg font-medium">*Team</label>
              <input
                type="text"
                className="rounded p-2 border border-gray-300 w-full mb-3"
                value={participant.team}
                onChange={(e) => handleChange(index, 'team', e.target.value)}
              />
              <label className="text-lg font-medium">*Account Number</label>
              <input
                type="text"
                className="rounded p-2 border border-gray-300 w-full mb-3"
                value={participant.AccountNumber}
                onChange={(e) => handleChange(index, 'AccountNumber', e.target.value)}
              />
              <label className="text-lg font-medium">*IFSC Code</label>
              <input
                type="text"
                className="rounded p-2 border border-gray-300 w-full"
                value={participant.AccountIFSCcode}
                onChange={(e) => handleChange(index, 'AccountIFSCcode', e.target.value)}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="bg-sky-900 text-white p-3 rounded-lg text-lg font-medium hover:bg-sky-700 transition duration-300">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResultPage;
