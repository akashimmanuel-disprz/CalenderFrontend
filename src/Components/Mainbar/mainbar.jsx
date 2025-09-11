// MainBar.jsx
import React, { useEffect, useState } from "react";
import MonthView from "./CalenderViews/MonthView";
import WeekView from "./CalenderViews/WeekView";
import DailyView from "./CalenderViews/DailyView";

function MainBar({ darkMode, selectedDate }) {
  const [activeView, setActiveView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Switch to Daily view when a date is selected from LeftBar
  useEffect(() => {
    if (selectedDate) {
      setActiveView("daily");
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  // Optional: handle date selection inside MonthView
  const handleDateSelect = (date) => {
    setCurrentDate(date);
    setActiveView("daily");
  };

  return (
    <div
      className={darkMode ? "mainbar dark" : "mainbar light"}
      style={{ marginTop: "40px" }}
    >
      {/* View toggle buttons */}
      <div className="view-toggle" style={{ marginBottom: "30px" }}>
        <button
          className={activeView === "month" ? "active" : ""}
          onClick={() => setActiveView("month")}
        >
          Month
        </button>
        <button
          className={activeView === "week" ? "active" : ""}
          onClick={() => setActiveView("week")}
        >
          Week
        </button>
        <button
          className={activeView === "daily" ? "active" : ""}
          onClick={() => setActiveView("daily")}
        >
          Daily
        </button>
      </div>

      {/* Calendar container */}
      <div className="calendar-container">
        {activeView === "month" && (
          <MonthView darkMode={darkMode} onSelectDate={handleDateSelect} />
        )}
        {activeView === "week" && (
          <WeekView darkMode={darkMode} currentDate={currentDate} />
        )}
        {activeView === "daily" && (
          <DailyView darkMode={darkMode} currentDate={currentDate} />
        )}
      </div>
    </div>
  );
}

export default MainBar;
