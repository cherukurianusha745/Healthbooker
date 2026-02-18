// components/PatientDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/patient.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointment/getappointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1>My Appointments</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/book-appointment")}
          >
            Book Appointment
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate("/doctor-apply")}
          >
            Apply as Doctor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/book-appointment")}
          >
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>Dr. {appointment.doctorId?.userId?.firstname} {appointment.doctorId?.userId?.lastname}</h3>
                <span className={`status-${appointment.status}`}>
                  {appointment.status === "pending" ? "Pending Approval" : appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <p><strong>Specialization:</strong> {appointment.doctorId?.specialization}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Booked on:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</p>
              </div>

              {appointment.status === "pending" && (
                <div className="appointment-footer">
                  <p className="waiting-message">⏳ Waiting for admin approval</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;