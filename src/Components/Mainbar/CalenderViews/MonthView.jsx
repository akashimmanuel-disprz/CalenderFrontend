import React, { useState } from "react";
import "./MonthView.css";

function MonthView({ events = [], darkMode }) {
    const today = new Date();

    // State for which month we are currently viewing
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Handlers for navigation
    const goToPreviousMonth = () => {
        const prevMonth = new Date(year, month - 1, 1);
        // Prevent moving before today's month
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
            {/* Header with month + navigation */}
            <div className={`month-header ${darkMode ? "dark" : "light"}`}>
                <button
                    onClick={goToPreviousMonth}
                    disabled={
                        year === today.getFullYear() && month === today.getMonth()
                    }
                >
                    ◀
                </button>
                <h2>
                    {currentDate.toLocaleString("default", { month: "long" })}{" "}
                    {year}
                </h2>
                <button onClick={goToNextMonth}>▶</button>
            </div>
            <div className={darkMode ? "month-grid dark" : "month-grid light"}>
                {daysArray.map((day) => {
                    const dayEvents = events.filter(
                        (e) => new Date(e.StartTime).getDate() === day
                    );
                    const isToday = today.getDate() === day;

                    return (
                        <div
                            key={day}
                            className={`month-cell ${isToday ? "today" : ""} ${darkMode ? "dark":"light"}`}
                        >

                            <div className="day-number">{day}</div>
                            {dayEvents.length > 0 && (
                                <div className="event">
                                    {dayEvents[0].Title}
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
