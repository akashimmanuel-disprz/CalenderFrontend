import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DailyView.css";

function DailyView({ darkMode }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());
  const timelineRef = useRef(null);

  const slotHeight = 60; // height in px for 30-min slots
  const scale = slotHeight / 30; // pixels per minute

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const dateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      try {
        const res = await axios.get(`http://localhost:5025/api/events/date?day=${dateString}`);
        const mapped = res.data.map((e) => {
          // Parse timestamp as local time (avoid timezone shifts)
          const [sy, sm, sd, sh, smin] = e.startTime.match(/\d+/g).map(Number);
          const [ey, em, ed, eh, emin] = e.endTime.match(/\d+/g).map(Number);
          const start = new Date(sy, sm - 1, sd, sh, smin);
          const end = new Date(ey, em - 1, ed, eh, emin);

          return {
            ...e,
            start,
            end,
            top: (start.getHours() * 60 + start.getMinutes()) * scale, // in px
            height: ((end - start) / (1000 * 60)) * scale, // duration in px
          };
        });
        setEvents(mapped);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [currentDate, scale]);

  // Auto-scroll to current time
  useEffect(() => {
    if (timelineRef.current) {
      const scrollTop = (now.getHours() * 60 + now.getMinutes()) * scale - 120;
      timelineRef.current.scrollTop = scrollTop > 0 ? scrollTop : 0;
    }
  }, [currentDate, now, scale]);

  // 30-minute slots
  const slots = Array.from({ length: 24 * 2 }, (_, i) => i);

  const formatTime = (slot) => {
    const hour = Math.floor(slot / 2);
    const minutes = slot % 2 === 0 ? "00" : "30";
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Navigation
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);

    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const prevDayOnly = new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate());

    if (prevDayOnly >= todayOnly) setCurrentDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  return (
    <div className={`daily-view ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="daily-header">
        <button
          onClick={goToPreviousDay}
          disabled={currentDate.toDateString() === today.toDateString()}
        >
          ◀
        </button>
        <h2>
          {currentDate.toLocaleDateString("default", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <button onClick={goToNextDay}>▶</button>
      </div>

      {/* Timeline */}
      <div className="timeline-container" ref={timelineRef}>
        {/* Current time line */}
        {now.toDateString() === currentDate.toDateString() && (
          <div className="current-time-line" style={{ top: `${nowMinutes * scale}px` }}></div>
        )}

        {/* 30-min slots */}
        {slots.map((slot) => (
          <div
            key={slot}
            className={`time-slot ${slot * 30 < nowMinutes ? "past" : ""}`}
            style={{ height: `${slotHeight}px` }}
          >
            <div className="time-label">{formatTime(slot)}</div>
          </div>
        ))}

        {/* Events */}
        {events.map((event, idx) => (
          <div
            key={idx}
            className="event"
            style={{ top: `${event.top}px`, height: `${event.height}px` }}
          >
            <div className="event-title">{event.title}</div>
            <div className="event-time">
              {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyView;
