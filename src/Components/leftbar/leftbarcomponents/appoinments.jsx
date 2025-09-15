import React, { useState, useEffect } from "react";
import { getAppointmentsByDate } from "../services/leftBarServices";
import { formatDateAPI } from "../utils/dateUtils"; // ✅ import for API formatting

function Appointment({ selectedDate, onSelect, darkMode }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointmentsByDate(formatDateAPI(selectedDate));
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setAppointments([]);
      }
    };
    fetchAppointments();
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
        <div>No appointments for this day.</div>
      )}
    </div>
  );
}

export default Appointment;
