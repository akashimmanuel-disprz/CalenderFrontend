import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeftBar.css";

function LeftBar({ darkMode, selectedDate, setSelectedDate, onSelectAppointment }) {
  const [appointments, setAppointments] = useState([]);

  const prevDay = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(selectedDate.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (yesterday >= today) setSelectedDate(yesterday);
  };

  const nextDay = () => {
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);
    setSelectedDate(tomorrow);
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate >= today) setSelectedDate(newDate);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatDateAPI = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5025/api/events/date?day=${formatDateAPI(selectedDate)}`
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [selectedDate]);

  return (
    <div className={darkMode ? "leftbar dark" : "leftbar light"}>
      <div className="header">
        <h2>Appointments</h2>
        <p>Manage your schedule</p>
      </div>

      <div className="date-navigator">
        <button onClick={prevDay}>&lt;</button>
        <span>{formatDate(selectedDate)}</span>
        <button onClick={nextDay}>&gt;</button>
      </div>

      <div className="toolbox">
        <input
          type="date"
          value={formatDateAPI(selectedDate)}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDateChange}
        />
      </div>

      <div className="section-title">Recents & Upcomings</div>

      <div className="appointment-list">
  {appointments.length > 0 ? (
    appointments.map((appt) => (
      <div
        key={appt.eventId}
        className="appointment-item"
        onClick={() => onSelectAppointment(appt)} // ✅ open edit modal
        style={{ cursor: "pointer" }}
      >
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
