import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResultPage = () => {
    const [eventId, setEventId] = useState('');
    const [email, setEmail] = useState('');
    const [round, setRound] = useState('');

    useEffect(() => {
        setEventId(localStorage.getItem('user'));
    }, [])

    const handlePromote = async () => {
        if (!eventId || !email || !round) {
            alert('Please enter all required fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/update-round-user', { eventId, email, round }, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data);
            alert('The event details are updated successfully');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Error updating event details');
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto font-poppins flex flex-col justify-center items-center pb-16 px-4 bg-gray-100">
            <h1 className="text-5xl font-bold text-sky-900 mb-10">Promote Participant</h1>
            <div className="flex flex-col h-full w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg">
                <label className="text-lg font-medium">*Event ID</label>
                <input
                    type="text"
                    className="rounded p-2 border border-gray-300 w-full mb-3"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                />
                <label className="text-lg font-medium">*Email</label>
                <input
                    type="email"
                    className="rounded p-2 border border-gray-300 w-full mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="text-lg font-medium">*Round</label>
                <input
                    type="text"
                    className="rounded p-2 border border-gray-300 w-full mb-3"
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                />
                <button
                    onClick={handlePromote}
                    className="bg-sky-900 text-white p-3 rounded-lg text-lg font-medium hover:bg-sky-700 transition duration-300"
                >
                    Promote to Next Round
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
