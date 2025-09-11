import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeftBar.css";

function LeftBar({ darkMode, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  // Navigate to previous day
  const prevDay = () => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (yesterday >= today) {
      setCurrentDate(yesterday);
      onSelectDate?.(yesterday); // notify MainBar
    }
  };

  // Navigate to next day
  const nextDay = () => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    setCurrentDate(tomorrow);
    onSelectDate?.(tomorrow); // notify MainBar
  };

  // Handle date picker
  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected >= today) {
      setCurrentDate(selected);
      onSelectDate?.(selected); // notify MainBar
    }
  };

  // Format date for display
  const formatDateDisplay = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Format date for API (YYYY-MM-DD)
  const formatDateAPI = (date) => date.toISOString().split("T")[0];

  // Fetch appointments whenever currentDate changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5025/api/events/date?day=${formatDateAPI(currentDate)}`
        );
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
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
        <span>{formatDateDisplay(currentDate)}</span>
        <button onClick={nextDay}>&gt;</button>
      </div>

      {/* Date picker */}
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
