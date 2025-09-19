import React, { useState } from "react";
import "./CreateAppointmentModal.css";
import { createAppointment } from "./MainService/AppointmentServices"; // ⬅️ import your function

function CreateAppointmentModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repetition, setRepetition] = useState("none");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (!repetition) newErrors.repetition = "Repetition type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    // Combine date + time into ISO datetime format for SQL Server
    const formatDateTime = (date, time) => {
      if (!date || !time) return null;
      const combined = new Date(`${date}T${time}`);
      const yyyy = combined.getFullYear();
      const mm = String(combined.getMonth() + 1).padStart(2, "0");
      const dd = String(combined.getDate()).padStart(2, "0");
      const hh = String(combined.getHours()).padStart(2, "0");
      const min = String(combined.getMinutes()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`; // ISO format
    };

    const payload = {
      Title: title.trim(),
      Description: description.trim(),
      StartTime: formatDateTime(date, startTime),
      EndTime: formatDateTime(date, endTime),
      RecurrenceType: repetition === "none" ? null : repetition,
      RecurrenceCount: repetition === "none" ? null : -1,
    };

    try {
      await createAppointment(payload); // ⬅️ use function instead of axios.post
      console.log("Appointment Created:", payload);
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please check your inputs.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Create Appointment</h2>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        {errors.description && <span className="error">{errors.description}</span>}

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <span className="error">{errors.date}</span>}

        <label>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        {errors.startTime && <span className="error">{errors.startTime}</span>}

        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        {errors.endTime && <span className="error">{errors.endTime}</span>}

        <label>Repetition Type</label>
        <select
          value={repetition}
          onChange={(e) => setRepetition(e.target.value)}
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        {errors.repetition && <span className="error">{errors.repetition}</span>}

        <div className="modal-actions">
          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAppointmentModal;
