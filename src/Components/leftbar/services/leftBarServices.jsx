import axios from "axios";

const API_BASE = "http://localhost:5186/api/events";

/**
 * Fetch a single appointment by its ID from the backend.
 * @param {number|string} id - The ID of the event
 * @returns {Promise<Object|null>} - The appointment object, or null if not found
 */
export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    return null;
  }
};
