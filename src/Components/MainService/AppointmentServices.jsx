import axios from "axios";

const API_BASE = "http://localhost:5083/api/Event";

// Helper: Get JWT token from localStorage
const getAuthConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch appointment by ID
export const fetchAppointmentById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`, getAuthConfig());
    return res.data;
  } catch (err) {
    console.error("Error fetching appointment:", err);
    throw err;
  }
};

// Create appointment
export const createAppointment = async (payload) => {
  try {
    // No need to pass createdById, backend handles it
    const res = await axios.post(API_BASE, payload, getAuthConfig());
    return res.data;
  } catch (err) {
    console.error("Error creating appointment:", err);
    throw err;
  }
};

// Update appointment
export const updateAppointment = async (id, payload) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, payload, getAuthConfig());
    return res.data; // return updated data
  } catch (err) {
    console.error("Error updating appointment:", err);
    throw err;
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    await axios.delete(`${API_BASE}/${id}`, getAuthConfig());
    return true;
  } catch (err) {
    console.error("Error deleting appointment:", err);
    throw err;
  }
};
