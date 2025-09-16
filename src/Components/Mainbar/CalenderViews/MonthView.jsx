// MonthView.jsx
import React, { useState, useEffect } from "react";
import { fetchAllEvents, getEventsByDate } from "../../MainService/DayAppointments"; // adjust path
import "../styles/MonthView.css";

function MonthView({ darkMode }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsByDay, setEventsByDay] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Fetch all events once, then group by date
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await fetchAllEvents(); // fetch all events from backend once

        const groupedEvents = {};
        daysArray.forEach((day) => {
          const date = new Date(year, month, day);
          const dateString = date.toISOString().split("T")[0];
          groupedEvents[dateString] = getEventsByDate(date); // get only events for that date
        });

        setEventsByDay(groupedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEventsByDay({});
      }
    };

    fetchEvents();
  }, [year, month]);

  // Navigation
  const goToPreviousMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);
    if (
      prevMonth.getFullYear() > today.getFullYear() ||
      (prevMonth.getFullYear() === today.getFullYear() &&
        prevMonth.getMonth() >= today.getMonth())
    ) {
      setCurrentDate(prevMonth);
    }
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);
    setCurrentDate(nextMonth);
  };

  return (
    <div className={`month-view ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className={`month-header ${darkMode ? "dark" : "light"}`}>
        <button
          onClick={goToPreviousMonth}
          disabled={year === today.getFullYear() && month === today.getMonth()}
        >
          ◀
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={goToNextMonth}>▶</button>
      </div>

      {/* Calendar grid */}
      <div className={darkMode ? "month-grid dark" : "month-grid light"}>
        {daysArray.map((day) => {
          const date = new Date(year, month, day);
          const dateString = date.toISOString().split("T")[0];
          const dayEvents = eventsByDay[dateString] || [];

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          const isPastDay =
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day < today.getDate();

          return (
            <div
              key={day}
              className={`month-cell 
                ${isToday ? "today" : ""} 
                ${isPastDay ? "past" : ""} 
                ${darkMode ? "dark" : "light"}`}
            >
              <div className="day-number">{day}</div>

              {/* Show only one event + count */}
              {dayEvents.length > 0 && (
                <div className="event">
                  {dayEvents[0]?.title || "Untitled Event"}
                  {dayEvents.length > 1 && (
                    <span className="more-events">
                      +{dayEvents.length - 1} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView;
