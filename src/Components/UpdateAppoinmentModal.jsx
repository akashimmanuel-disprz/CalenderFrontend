// EditAppointmentModal.jsx
import React, { useState, useEffect } from "react";
import "./UpdateModal.css";
import axios from "axios";
import { Trash2 } from "lucide-react";

function EditAppointmentModal({ appointment, onClose, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repetition, setRepetition] = useState("none");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill form with appointment
  useEffect(() => {
    if (appointment) {
      // Title / Description
      setTitle(appointment.title || appointment.Title || "");
      setDescription(appointment.description || appointment.Description || "");

      // Start time
      const start = appointment.startTime || appointment.StartTime;
      if (start) {
        const startDate = new Date(start);
        setDate(startDate.toISOString().split("T")[0]);
        setStartTime(startDate.toISOString().split("T")[1].slice(0, 5));
      }

      // End time
      const end = appointment.endTime || appointment.EndTime;
      if (end) {
        const endDate = new Date(end);
        setEndTime(endDate.toISOString().split("T")[1].slice(0, 5));
      }

      // Recurrence
      setRepetition(
        appointment.recurrence?.recurrenceType ||
          appointment.RecurrenceType ||
          "none"
      );
    }
  }, [appointment]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Format datetime for backend
  const formatDateTime = (date, time) =>
    date && time ? `${date}T${time}:00` : null;

  // ✅ Save (Update)
  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      eventId: appointment.eventId || appointment.Id, // 🔑 correct ID
      title: title.trim(),
      description: description.trim(),
      startTime: formatDateTime(date, startTime),
      endTime: formatDateTime(date, endTime),
      recurrence: {
        recurrenceType: repetition === "none" ? null : repetition,
        recurrenceCount: repetition === "none" ? null : -1,
      },
    };

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5025/api/events/${payload.eventId}`,
        payload
      );
      console.log("✅ Appointment Updated:", payload);
      onClose(true);
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
      alert("Failed to update appointment.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async () => {
    const id = appointment.eventId || appointment.Id;
    if (!id) {
      alert("Missing eventId for deletion.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5025/api/events/${id}`);
      console.log("🗑️ Appointment Deleted:", id);
      if (onDelete) onDelete(id);
      onClose(true);
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      alert("Failed to delete appointment.");
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => onClose(false)}>✕</button>

        <h2>Edit Appointment</h2>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        <label>Repetition</label>
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

        <div className="modal-actions">
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={18} /> Delete
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAppointmentModal;
