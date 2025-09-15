import axios from "axios";

const API_BASE = "http://localhost:5025/api/events";

/**
 * Fetch appointments for a specific date from the backend.
 * @param {Date} date - The selected date
 * @returns {Promise<Array>} - List of appointments
 */
export const getAppointmentsByDate = async (date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const response = await axios.get(`${API_BASE}/date?day=${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};
