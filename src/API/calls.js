import axios from "axios";

export const mainBACKEND_URL = "https://kriyabackend.psgtech.ac.in";
// export const BACKEND_URL = "https://kriyabackend.psgtech.ac.in";

const mainBASE_URL = `${mainBACKEND_URL}/api`;

// export const BASE_URL = "https://kriyadb.psgtech.ac.in/api";
export const BASE_URL = "https://kriyabackend.psgtech.ac.in/api";

export const AUTH_URL = `${BASE_URL}/convenor-auth`;
// export const REGISTER_URL = 'https://convener-backend.psgtech.ac.in';
export const REGISTER_URL = "https://kriyaconvenordb.psgtech.ac.in";

export const submitWinnerDetails = async (formData) => {
  try {
    console.log("FormData contents:");

    // Log each entry separately
    for (const [key, value] of Object.entries(formData)) {
      console.log(`${key}: ${value}`);
    }

    const res = await axios.post(
      `${REGISTER_URL}/winner-details`,
      formData,
      {}
    );

    console.log("Winner details submitted:", res.data);
    return res.data; // Return response data if needed
  } catch (error) {
    console.error(
      "Error submitting winner details:",
      error.response?.data || error.message
    );

    // Optionally return an error response or throw an error
    return {
      success: false,
      error: error.response?.data || "An error occurred",
    };
  }
};

export const getEventCount = async (id) => {
  try {
    const res = await axios.get(`${REGISTER_URL}/participants-count/${id}`);

    console.log("Count details:", res.data);
    return res.data; // Return the fetched winner details
  } catch (error) {
    console.error(
      "Error fetching count details:",
      error.response?.data || error.message
    );

    // Return an error response
    return {
      success: false,
      error:
        error.response?.data ||
        "An error occurred while fetching count details",
    };
  }
};

export const getWinnerDetails = async (id) => {
  try {
    const res = await axios.get(`${REGISTER_URL}/winner-details/${id}`);

    console.log("Winner details fetched:", res.data);
    return res.data; // Return the fetched winner details
  } catch (error) {
    console.error(
      "Error fetching winner details:",
      error.response?.data || error.message
    );

    // Return an error response
    return {
      success: false,
      error:
        error.response?.data ||
        "An error occurred while fetching winner details",
    };
  }
};

export const uploadPdf = async (file, kriyaId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log(file, formData, "hjvdhjvdjv", kriyaId);

    const res = await axios.post(
      `${mainBASE_URL}/upload`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          filetype: "PASSBOOK",
          kriyaId: kriyaId,
        },
      }
    );

    console.log("Uploaded PDF:", res.data);

    return res; // Assuming the server sends back the URL of the uploaded PDF
  } catch (err) {
    console.error("Error uploading PDF:", err);
    throw err;
  }
};

export const fetchRegister = (formData) =>
  axios.post(`${AUTH_URL}/register`, formData, {});

export const fetchLogin = (formData) =>
  axios.post(`${AUTH_URL}/login`, formData, {});

export const fetchParticipantDetails = (id) =>
  axios.get(`${BASE_URL}/auth/kriya-id/${id}`, {});

export const fetchApplyAttendanceIndividual = (formData) =>
  axios.post(`${REGISTER_URL}/markAttendance/`, formData, {});

export const fetchAttendanceFalse = (formData) =>
  axios.post(`${REGISTER_URL}/attend-false`, formData, {});

export const fetchApplyAttendanceIndividualWorkshop = (formData) =>
  axios.post(`${REGISTER_URL}/attendws/`, formData, {});

export const fetchAttendanceFalseWorkshop = (formData) =>
  axios.post(`${REGISTER_URL}/attend-falsews`, formData, {});

export const fetchApplyAttendanceIndividualPaper = (formData) =>
  axios.post(`${REGISTER_URL}/attendp/`, formData, {});

export const fetchAttendanceFalsePaper = (formData) =>
  axios.post(`${REGISTER_URL}/attend-falsep`, formData, {});

export const fetchAttendees = (id) =>
  axios.get(`${REGISTER_URL}/attendees/${id}`);

export const fetchAttendeesWorkshop = (id) =>
  axios.get(`${REGISTER_URL}/attendeesworkshop/${id}`);

export const fetchAttendeesPaper = (id) =>
  axios.get(`${REGISTER_URL}/attendeespaper/${id}`);

export const fetchParticipantDetailsForevent = (id) =>
  axios.get(`${REGISTER_URL}/users-from-event/${id}`, {});

export const fetchParticipantDetailsForWorkshop = (id) =>
  axios.get(`${REGISTER_URL}/wsparticipants/${id}`, {});

export const fetchParticipantDetailsForPaper = (id) =>
  axios.get(`${REGISTER_URL}/ppparticipants/${id}`, {});

export const fetchAttendeesCountForEvent = (id) =>
  axios.get(`${BASE_URL}/statistics/attendance-by-eventid/${id}`);


export const fetchUserPaymentDetails = async (kriyaid, eventid) => {
  try {
    console.log("Fetching user payment details for:", kriyaid, eventid);
    const res = await axios.post(`${BASE_URL}/payment/user-payment-details`, {
      kriyaid,
      eventid,
    });

    console.log("User payment details fetched:", res.data);
    return res; // Return the axios response directly
  } catch (error) {
    console.error(
      "Error fetching user payment details:",
      error.response?.data || error.message
    );

    // Re-throw the error to be caught by the toast.promise
    throw error;
  }
};