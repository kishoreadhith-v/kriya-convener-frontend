import axios from "axios";

// export const BASE_URL = "https://kriyadb.psgtech.ac.in/api";
export const BASE_URL = "https://kriyabackend.psgtech.ac.in/api";

export const AUTH_URL = `${BASE_URL}/convenor-auth`;
// export const REGISTER_URL = 'https://convener-backend.psgtech.ac.in';
export const REGISTER_URL = "https://kriyaconvenordb.psgtech.ac.in";

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
