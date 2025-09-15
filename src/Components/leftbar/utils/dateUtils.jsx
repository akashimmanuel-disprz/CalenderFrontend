// utils/dateUtils.js

// Format date for display (e.g., "September 15, 2025")
export const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// Format date for API calls (e.g., "2025-09-15")
export const formatDateAPI = (date) => date.toISOString().split("T")[0];
