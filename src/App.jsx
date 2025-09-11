import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import LeftBar from "./Components/leftbar/LeftBar";
import MainBar from "./Components/Mainbar/mainbar";
import CreateAppointmentModal from "./Components/CreateAppoinmentModal";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Track selected date from LeftBar
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Left Sidebar */}
      <LeftBar darkMode={darkMode} onSelectDate={setSelectedDate} />

      {/* Main content */}
      <div className="main-content">
        {/* Top-left Create Appointment button */}
        <button
          className="create-appointment-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Appointment
        </button>

        {/* Top-right Settings */}
        <div className="settings-container">
          <FiSettings className="settings-icon" onClick={toggleSettings} />
          {showSettings && (
            <div className="settings-menu">
              <button onClick={toggleDarkMode}>
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          )}
        </div>

        {/* Main Calendar Views */}
        <MainBar darkMode={darkMode} selectedDate={selectedDate} />

        {/* Create Appointment Modal */}
        {showModal && (
          <CreateAppointmentModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
