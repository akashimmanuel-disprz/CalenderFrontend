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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* LeftBar */}
      <LeftBar 
        darkMode={darkMode} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />

      {/* MainBar */}
      <div className="main-content">
        <div className="top-bar">
          <button
            className="create-btn"
            onClick={() => setShowModal(true)}
          >
            + Create Appointment
          </button>
        </div>

        <MainBar 
          darkMode={darkMode} 
          selectedDate={selectedDate} 
        />

        {showModal && (
          <CreateAppointmentModal onClose={() => setShowModal(false)} />
        )}

        {/* Settings */}
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
      </div>
    </div>
  );
}

export default App;
