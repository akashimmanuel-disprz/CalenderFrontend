// Appointment.jsx
import React, { useState, useEffect } from "react";
import { fetchAllEvents, getEventsByDate } from "../../MainService/DayAppointments";

function Appointment({ selectedDate, onSelect, darkMode }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // fetch all events once
        await fetchAllEvents();

        // get events only for the selected date
        const eventsForDay = getEventsByDate(selectedDate);
        setAppointments(eventsForDay);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      }
    };

    if (selectedDate) {
      fetchAppointments();
    }
  }, [selectedDate]);

  return (
    <div className="appointment-list">
      {appointments.length > 0 ? (
        appointments.map((appt) => (
          <div
            key={appt.eventId}
            className="appointment-item"
            onClick={() => onSelect(appt)}
            style={{ cursor: "pointer" }}
          >
            <strong>{appt.title}</strong>
            <p>{appt.description}</p>
          </div>
        ))
      ) : (
        <div>No appointments found.</div>
      )}
    </div>
  );
}

export default Appointment;
