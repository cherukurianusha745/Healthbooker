import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      
      <ul className="sidebar-menu">
        {/* Appointments */}
        <li>
          <NavLink 
            to="/dashboard/appointments" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="icon">📅</span>
            Appointments
          </NavLink>
        </li>

        {/* Notifications */}
        <li>
          <NavLink 
            to="/notifications" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="icon">🔔</span>
            Notifications
          </NavLink>
        </li>

        {/* Contact */}
        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="icon">📞</span>
            Contact
          </NavLink>
        </li>

        {/* Profile */}
        <li>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="icon">👤</span>
            Profile
          </NavLink>
        </li>

        {/* Home */}
        <li className="home-item">
          <NavLink 
            to="/" 
            className="home-link"
          >
            <span className="icon">🏠</span>
            Home
          </NavLink>
        </li>
      </ul>
<li>
  <NavLink 
    to="/dashboard/admin-doctors" 
    className={({ isActive }) => isActive ? "active" : ""}
  >
    <span className="icon">👨‍⚕️</span>
    Manage Doctors
  </NavLink>
</li>
      {/* Logout Button */}
      <div className="logout-container" onClick={handleLogout}>
        <span className="icon">🚪</span>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;