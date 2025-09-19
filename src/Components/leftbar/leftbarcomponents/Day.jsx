import React from "react";
import { formatDate } from "../utils/dateUtils"; // ✅ import formatDate

function Day({ selectedDate, setSelectedDate }) {
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

  return (
    <div>
      <div className="date-navigator">
        <button onClick={prevDay}>&lt;</button>
        <span style={{paddingRight:"0px !important"}}>{formatDate(selectedDate)}</span>
        <button onClick={nextDay}>&gt;</button>
      </div>

      <div className="toolbox">
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

export default Day;
