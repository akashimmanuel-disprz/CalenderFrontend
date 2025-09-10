import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeftBar.css";

function LeftBar({ darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  // Navigate dates
  const prevDay = () => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (yesterday >= today) setCurrentDate(yesterday);
  };

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  // Handle date picker
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) setCurrentDate(selectedDate);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateAPI = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Fetch appointments whenever currentDate changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5025/api/events/date?day=${formatDateAPI(currentDate)}`
        );
        setAppointments(res.data); // assuming your API returns an array of events
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]); // fallback
      }
    };

    fetchAppointments();
  }, [currentDate]);

  return (
    <div className={darkMode ? "leftbar dark" : "leftbar light"}>
      {/* Header */}
      <div className="header">
        <h2>Appointments</h2>
        <p>Manage your schedule</p>
      </div>

      {/* Date navigator */}
      <div className="date-navigator">
        <button onClick={prevDay}>&lt;</button>
        <span>{formatDate(currentDate)}</span>
        <button onClick={nextDay}>&gt;</button>
      </div>

      {/* Toolbox: Date picker */}
      <div className="toolbox">
        <input
          type="date"
          value={formatDateAPI(currentDate)}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDateChange}
        />
      </div>

      {/* Recents & Upcomings */}
      <div className="section-title">Recents & Upcomings</div>

      {/* Appointment list */}
      <div className="appointment-list">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <div key={appt.eventId} className="appointment-item">
              <strong>{appt.title}</strong>
              <p>{appt.description}</p>
            </div>
          ))
        ) : (
          <div>No appointments for this day.</div>
        )}
      </div>
    </div>
  );
}

export default LeftBar;
