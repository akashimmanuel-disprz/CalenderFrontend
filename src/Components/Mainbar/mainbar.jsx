import React, { useState } from "react";
import "./MainBar.css";

function MainBar({ darkMode }) {
  const [activeView, setActiveView] = useState("month"); // default = month

  return (
    <div className={darkMode ? "mainbar dark" : "mainbar light"}>
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
    </div>
  );
}

export default MainBar;
