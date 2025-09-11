import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MonthView.css";

function MonthView({ darkMode }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsByDay, setEventsByDay] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ✅ Fetch events for each day of the current month
  useEffect(() => {
    const fetchEvents = async () => {
      const newEvents = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;

        try {
          const res = await axios.get(
            `http://localhost:5025/api/events/date?day=${dateString}`
          );

          newEvents[dateString] = res.data;
          
        } catch (err) {
          console.error("Error fetching events for", dateString, err);
          newEvents[dateString] = [];
        }
      }

      setEventsByDay(newEvents);
    };

    fetchEvents();
  }, [year, month, daysInMonth]);

  // ✅ Navigation
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
//   console.log(dayEvents[0])
  return (
    <div className={`month-view ${darkMode ? "dark" : "light"}`}>
      {/* Header with month + navigation */}
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
          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
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

              {/* ✅ Show only one event + count */}
              {dayEvents.length > 0 && (
                <div className="event">
  {dayEvents[0]?.title || "Test Event"}
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
