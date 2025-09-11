import React, { useState } from "react";
import "./MainBar.css";
import MonthView from "./CalenderViews/MonthView";
import WeekView from "./CalenderViews/WeekView";
import DailyView from "./CalenderViews/DailyView";
function MainBar({ darkMode, events = [] }) {
  const [activeView, setActiveView] = useState("month"); // default = month

  return (
    <div className={darkMode ? "mainbar dark" : "mainbar light"}>
      {/* View toggle buttons */}
      <div className="view-toggle">
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

      {/* Calendar Views */}
      <div className="calendar-container">
        {activeView === "month" && <MonthView events={events} />}
        {activeView === "week" && <WeekView darkMode={darkMode} events={events} />}
        {activeView === "daily" && <DailyView darkMode={darkMode} events={events} />}
        {/* WeekView and DailyView can be added here later */}
      </div>
    </div>
  );
}

export default MainBar;
