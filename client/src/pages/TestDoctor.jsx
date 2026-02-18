import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5002/api";

const TestDoctor = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("👤 Logged in as:", user);

        // Get doctor profile
        const profileRes = await axios.get("/doctors/get-doctor-profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("📋 Doctor Profile:", profileRes.data);
        setDoctorData(profileRes.data);

        // Get appointments
        const appsRes = await axios.get("/appointment/doctor-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("📅 Appointments:", appsRes.data);
        setAppointments(appsRes.data);

      } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Loading...</h2>
    </div>
  );

  if (error) return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "red" }}>Error: {error}</h2>
    </div>
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Doctor Test Page</h1>
      
      <div style={{ background: "#f0f0f0", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "15px" }}>Doctor Information:</h2>
        <pre style={{ background: "#fff", padding: "15px", borderRadius: "5px", overflow: "auto" }}>
          {JSON.stringify(doctorData, null, 2)}
        </pre>
      </div>

      <div style={{ background: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "15px" }}>Appointments ({appointments.length}):</h2>
        {appointments.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No appointments found</p>
        ) : (
          <pre style={{ background: "#fff", padding: "15px", borderRadius: "5px", overflow: "auto" }}>
            {JSON.stringify(appointments, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button 
          onClick={() => window.location.href = "/doctor"}
          style={{
            padding: "10px 20px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Go to Doctor Dashboard
        </button>
        <button 
          onClick={() => window.location.href = "/"}
          style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default TestDoctor;