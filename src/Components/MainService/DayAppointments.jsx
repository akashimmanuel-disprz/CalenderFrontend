// src/services/eventService.js
import axios from "axios";

const API_BASE = "http://localhost:5083/api/Event"; // your backend endpoint

let allEvents = []; // store all events in memory

// Helper: get JWT auth config
const getAuthConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Fetch all events from backend once
 */
export const fetchAllEvents = async () => {
  try {
    
    const res = await axios.get(API_BASE, getAuthConfig());
    allEvents = res.data.map(event => ({
      ...event,
      date: new Date(event.startTime).toISOString().split("T")[0], // normalize date
    }));
    return allEvents;
  } catch (err) {
    console.error("Error fetching all events:", err);
    return [];
  }
};

/**
 * Get events for a specific date
 * @param {string|Date} date - date string "YYYY-MM-DD" or Date object
 * @returns {Array} events on that date
 */
export const getEventsByDate = (date) => {
  const dateStr =
    date instanceof Date ? date.toISOString().split("T")[0] : date;
  return allEvents.filter(event => event.date === dateStr);
};
