import React, { useEffect, useState } from "react";
import { fetchAppointmentById, updateAppointment, deleteAppointment } from "./MainService/AppointmentServices";

function EditAppointment({ appointmentId, onClose }) {
  const [appointment, setAppointment] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch appointment on mount
  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const data = await fetchAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        setError("Failed to fetch appointment");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      await updateAppointment(appointmentId, appointment);
      alert("Appointment updated successfully!");
      onClose(); // close modal
    } catch (err) {
      setError("Failed to update appointment");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(appointmentId);
        alert("Appointment deleted successfully!");
        onClose(); // close modal
      } catch (err) {
        setError("Failed to delete appointment");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="edit-appointment-modal">
      <h2>Edit Appointment</h2>
      <input
        type="text"
        name="title"
        value={appointment.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={appointment.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="date"
        name="date"
        value={appointment.date}
        onChange={handleChange}
      />
      <input
        type="time"
        name="startTime"
        value={appointment.startTime}
        onChange={handleChange}
      />
      <input
        type="time"
        name="endTime"
        value={appointment.endTime}
        onChange={handleChange}
      />

      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete} style={{ color: "red" }}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditAppointment;
