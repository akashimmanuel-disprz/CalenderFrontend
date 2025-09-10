import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import LeftBar from "./Components/leftbar/LeftBar";
import MainBar from "./Components/Mainbar/mainbar";
import CreateAppointmentModal from "./Components/CreateAppoinmentModal"; // ✅ new import
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Left Sidebar */}
      <LeftBar darkMode={darkMode} />

      {/* MainBar occupies the entire right side */}
      <div className="main-content">
        {/* Top-left create button */}
        <button
          className="create-appointment-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Appointment
        </button>

        {/* Top-right settings icon */}
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

        {/* Main content replaced by MainBar */}
        <MainBar darkMode={darkMode} />

        {/* Show modal if state true */}
        {showModal && (
          <CreateAppointmentModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
