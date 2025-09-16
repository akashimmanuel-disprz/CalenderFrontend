// WeekView.jsx
import React, { useState, useEffect } from "react";
import { fetchAllEvents, getEventsByDate } from "../../MainService/DayAppointments"; // adjust path
import "../styles/WeekView.css";

function WeekView({ darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);

  // Fetch all events once, filter by week locally
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await fetchAllEvents(); // fetch all events once

        let weekEvents = [];
        daysArray.forEach((day) => {
          const eventsForDay = getEventsByDate(day); // get events for the day
          const mapped = eventsForDay.map((e) => {
            const start = new Date(e.startTime);
            return {
              ...e,
              Hour: start.getHours(),
              DateString: start.toISOString().split("T")[0],
            };
          });
          weekEvents = [...weekEvents, ...mapped];
        });

        setEvents(weekEvents);
      } catch (err) {
        console.error("Error fetching week events:", err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [currentDate]);

  // Convert 24h to 12h format
  const formatHour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h} ${suffix}`;
  };

  const isPast = (hour, day) => {
    const now = new Date();
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    return (
      dayStart < new Date(now.setHours(0, 0, 0, 0)) ||
      (day.toDateString() === new Date().toDateString() && hour < new Date().getHours())
    );
  };

  return (
    <div className={`week-view ${darkMode ? "dark" : "light"}`}>
      {/* Top header with day names */}
      <div className="week-header">
        <div className="time-column-header"></div>
        {daysArray.map((day, idx) => (
          <div key={idx} className="week-day">
            {day.toLocaleString("default", { weekday: "short" })} <br />
            {day.getDate()}/{day.getMonth() + 1}
          </div>
        ))}
      </div>

      {/* Grid of hours */}
      <div className="week-grid">
        {hoursArray.map((hour) => (
          <div key={hour} className="week-row">
            {/* Time column */}
            <div className={`time-column ${darkMode ? "dark" : "light"}`}>
              {formatHour(hour)}
            </div>

            {/* Hour cells for each day */}
            {daysArray.map((day, idx) => {
              const cellDateString = day.toISOString().split("T")[0];
              const eventForHour = events.find(
                (e) => e.Hour === hour && e.DateString === cellDateString
              );

              return (
                <div
                  key={idx}
                  className={`week-cell ${darkMode ? "dark" : "light"} ${
                    isPast(hour, day) ? "past" : ""
                  }`}
                >
                  {eventForHour && <div className="event">{eventForHour.title}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekView;
