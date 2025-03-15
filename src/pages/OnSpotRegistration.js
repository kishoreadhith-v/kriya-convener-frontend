import React, { useState } from "react";
import { toast } from "react-hot-toast";
import KriyaInput from "../components/KriyaInput";
import Button from "../components/Button";
import { fetchUserPaymentDetails, fetchParticipantDetails } from "../API/calls";
import axios from "axios";

const OnSpotRegistration = () => {
    const [kriyaId, setKriyaId] = useState("");
    const [userData, setUserData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const currentUser = localStorage.getItem("user");

    const handleChange = (val) => {
        setKriyaId(val);
        if (val.length >= 4) {
            setTimeout(() => {
                const currentUser = localStorage.getItem("user");

                // Special handling for workshop users
                if (currentUser.charAt(0) === "W") {
                    console.log(`KRIYA${val}`, currentUser);
                    toast.promise(fetchUserPaymentDetails(`KRIYA${val}`, currentUser), {
                        loading: "Loading workshop participant details...",
                        success: (data) => {
                            console.log("Workshop user data:", data.data.user);
                            setUserData(data.data.user);
                            return "Workshop participant details loaded successfully";
                        },
                        error: (err) => {
                            setKriyaId("");
                            console.log("Error fetching workshop user:", err);
                            return "Error fetching workshop participant details";
                        },
                    });

                } else {
                    // Regular participant details fetching for non-workshop users
                    toast.promise(fetchParticipantDetails(`KRIYA${val}`), {
                        loading: "Loading participant details...",
                        success: (data) => {
                            console.log("Regular participant data:", data);
                            setUserData(data.data.user);
                            return "Participant details loaded successfully";
                        },
                        error: (err) => {
                            setKriyaId("");
                            console.log("Error fetching participant:", err);
                            return "Error fetching participant details";
                        },
                    });
                }
            }, 100);
        }
    };
    const handleOnSpotRegistration = async () => {
        if (!kriyaId) {
            toast.error("Please enter a valid Kriya ID");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await axios.post(
                "https://kriyaconvenordb.psgtech.ac.in/markAttendance-onspot",
                {
                    eventId: currentUser,
                    kriyaId: kriyaId
                }
            );

            if (response.data.success) {
                toast.success("On-spot registration successful!");
                setKriyaId("");
                setUserData(null);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to register participant. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto font-poppins pb-16 px-4">
            <h1 className="text-4xl font-semibold text-sky-900 mb-8">
                On-Spot Registration
            </h1>

            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 h-fit">
                <div className="w-full lg:w-fit h-fit">
                    <p className="text-lg">Enter Kriya ID</p>
                    <KriyaInput value={kriyaId} handleChange={handleChange} />
                    <div className="mt-8 flex items-center space-x-4">
                        <Button
                            text={isProcessing ? "Processing..." : "Register & Mark Attendance"}
                            handleClick={handleOnSpotRegistration}
                            disabled={isProcessing || !kriyaId}
                        />
                        <Button
                            handleClick={(e) => {
                                e.preventDefault();
                                setKriyaId("");
                                setUserData(null);
                            }}
                            outlined
                            text="Clear"
                        />
                    </div>
                </div>

                {userData ? (
                    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-sky-900">Participant Details</h2>

                        {/* Payment status display */}
                        {userData.isPaid ? (
                            <div className="text-emerald-600 font-semibold text-3xl">
                                Paid!
                            </div>
                        ) : (
                            <div className="text-red-600 font-semibold text-3xl">
                                Not Paid!
                            </div>
                        )}

                        <div className="flex items-center">
                            <p className="font-semibold w-[10ch]">Name</p>
                            <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch]">
                                {userData.name}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p className="font-semibold w-[10ch]">Email</p>
                            <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch]">
                                {userData.email}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p className="font-semibold w-[10ch]">College</p>
                            <p className="flex-1 [overflow-wrap:break-word] [inline-size:10ch] lg:[inline-size:30ch]">
                                {userData.college}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p className="font-semibold w-[10ch]">Kriya ID</p>
                            <p className="flex-1 text-sky-700 font-medium">
                                KRIYA{kriyaId}
                            </p>
                        </div>

                        <div className="mt-4 p-3 bg-sky-50 rounded-md">
                            <p className="text-sky-800">
                                Click "Register & Mark Attendance" to complete on-spot registration for this participant.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full bg-gray-200 h-full p-8 flex justify-center items-center mt-4">
                        <p className="text-gray-400 text-2xl font-bold">
                            No Data Available!
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg text-sky-900">About On-Spot Registration</h3>
                <p className="mt-2 text-gray-700">
                    This page allows you to register participants who arrive at the event venue without prior registration.
                    Enter their Kriya ID to retrieve their details, and then complete the registration process.
                </p>
            </div>
        </div>
    );
};

export default OnSpotRegistration;