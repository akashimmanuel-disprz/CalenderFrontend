import React from "react";
import "../styles/header.css";

const Header = ({ title, subtitle, isDarkMode }) => {
  return (
    <div className={`header ${isDarkMode ? "dark" : ""}`}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
};

export default Header;
