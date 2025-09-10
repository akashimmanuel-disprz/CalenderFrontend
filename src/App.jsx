import React from "react";
import LeftBar from "./Components/leftbar/LeftBar";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <LeftBar />
      <div className="main-content">
        {/* This is the placeholder for your main calendar or right content */}
        <h2>Main Content</h2>
      </div>
    </div>
  );
};

export default App;
