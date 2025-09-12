import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import LeftBar from "./Components/leftbar/LeftBar";
import MainBar from "./Components/Mainbar/mainbar";
import CreateAppointmentModal from "./Components/CreateAppoinmentModal";
import EditAppointmentModal from "./Components/UpdateAppoinmentModal"; 
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Left Sidebar */}
      <LeftBar
        darkMode={darkMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSelectAppointment={setSelectedAppointment} // pass callback to LeftBar
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <button
            className="create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Appointment
          </button>
        </div>

        {/* Main Bar (Day/Month Views etc.) */}
        <MainBar
          darkMode={darkMode}
          selectedDate={selectedDate}
          onSelectAppointment={setSelectedAppointment} // pass callback to DailyView/MonthView inside MainBar
        />

        {/* Create Modal */}
        {showCreateModal && (
          <CreateAppointmentModal onClose={() => setShowCreateModal(false)} />
        )}

        {/* Edit Modal */}
        {selectedAppointment && (
          <EditAppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onDelete={(id) => {
              console.log("Deleted:", id);
              setSelectedAppointment(null);
            }}
          />
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
