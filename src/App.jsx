import React, { useState } from "react";
import LeftBar from "./Components/leftbar/LeftBar";
import MainBar from "./Components/Mainbar/mainbar";
import CreateAppointmentModal from "./Components/CreateAppoinmentModal";
import EditAppointmentModal from "./Components/UpdateAppoinmentModal";
import LoginPage from "./Auth/LoginPage";
import AuthService from "./service/AuthService";
import "./App.css";
import { CgDarkMode } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    AuthService.logout(); // clear token
    setIsLoggedIn(false);
  };

  // If not logged in, show the login page
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={() => setIsLoggedIn(true)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Left Sidebar */}
      <LeftBar
        darkMode={darkMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSelectAppointment={setSelectedAppointment}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <button
            className="create-appointment-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Appointment
          </button>

          {/* Settings Button */}
          <div className="settings-container">
            <button
              className="darkmode-circle"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              ⚙
            </button>
            {settingsOpen && (
              <div className="settings-menu">
                <button onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: "8px" }} /> Logout
                </button>
                <button onClick={toggleDarkMode}>
                  <CgDarkMode style={{ marginRight: "8px" }} />{" "}
                  {darkMode ? "Light" : "Dark"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Bar */}
        <MainBar
          darkMode={darkMode}
          selectedDate={selectedDate}
          onSelectAppointment={setSelectedAppointment}
        />

        {/* Create Appointment Modal */}
        {showCreateModal && (
          <CreateAppointmentModal onClose={() => setShowCreateModal(false)} />
        )}

        {/* Edit Appointment Modal */}
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
      </div>
    </div>
  );
}

export default App;
