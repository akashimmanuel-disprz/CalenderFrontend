// DailyView.jsx
import React, { useState, useEffect, useRef } from "react";
import { fetchAllEvents, getEventsByDate } from "../../MainService/DayAppointments"; // adjust path
import "../styles/DailyView.css";

function DailyView({ darkMode, currentDate, onSelectAppointment }) {
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());
  const timelineRef = useRef(null);

  const slotHeight = 60; // px per 30-min interval
  const scale = slotHeight / 30; // pixels per minute

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all events once, filter locally by selectedDate
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // fetch all events only once
        await fetchAllEvents();

        // get events only for currentDate
        const filtered = getEventsByDate(currentDate).map((e) => {
          const start = new Date(e.startTime);
          const end = new Date(e.endTime);
          return {
            ...e,
            start,
            end,
            top: (start.getHours() * 60 + start.getMinutes()) * scale,
            height: ((end - start) / (1000 * 60)) * scale,
          };
        });

        setEvents(filtered);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      }
    };

    fetchAppointments();
  }, [currentDate]);

  // Auto-scroll to current time
  useEffect(() => {
    if (timelineRef.current) {
      const scrollTop = (now.getHours() * 60 + now.getMinutes()) * scale - 120;
      timelineRef.current.scrollTop = scrollTop > 0 ? scrollTop : 0;
    }
  }, [now]);

  // 30-min slots
  const slots = Array.from({ length: 48 }, (_, i) => i);

  const formatTime = (slot) => {
    const hour = Math.floor(slot / 2);
    const minutes = slot % 2 === 0 ? "00" : "30";
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Navigate days
  const goToPreviousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 1);

    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const prevOnly = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());

    if (prevOnly >= todayOnly) {
      onSelectAppointment(null);
      setCurrentDate(prev);
    }
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 1);
    onSelectAppointment(null);
    setCurrentDate(next);
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
        {now.toDateString() === currentDate.toDateString() && (
          <div className="current-time-line" style={{ top: `${nowMinutes * scale}px` }} />
        )}

        {/* Time slots */}
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
            className="event-box"
            style={{ top: `${event.top}px`, height: `${event.height}px` }}
            onClick={() => onSelectAppointment(event)}
          >
            <strong>{event.title}</strong>
            <span>
              {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
              -{" "}
              {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyView;
