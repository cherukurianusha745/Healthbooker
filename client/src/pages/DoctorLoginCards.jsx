import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5002/api";

const DoctorLoginCards = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/doctors/get-doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDoctor = async (email) => {
    try {
      const response = await axios.post("/users/login", {
        email,
        password: "doctor123"
      });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      alert(`✅ Logged in as ${response.data.user.firstname} ${response.data.user.lastname}`);
      navigate("/doctor");
    } catch (error) {
      alert(`❌ Login failed for ${email}`);
    }
  };

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Select a Doctor to Login</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "20px" 
      }}>
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s, boxShadow 0.2s",
              border: "1px solid #e0e0e0"
            }}
            onClick={() => loginAsDoctor(doctor.email)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#4a6cf7",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              margin: "0 auto 15px"
            }}>
              {doctor.name?.charAt(0) || 'D'}
            </div>
            <h3 style={{ textAlign: "center", margin: "10px 0", color: "#333" }}>
              {doctor.name}
            </h3>
            <p style={{ textAlign: "center", color: "#4a6cf7", fontWeight: "600" }}>
              {doctor.specialization}
            </p>
            <div style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "15px"
            }}>
              <p style={{ margin: "5px 0", color: "#666" }}>
                <strong>Email:</strong> {doctor.email}
              </p>
              <p style={{ margin: "5px 0", color: "#666" }}>
                <strong>Experience:</strong> {doctor.experience} years
              </p>
              <p style={{ margin: "5px 0", color: "#666" }}>
                <strong>Fee:</strong> ${doctor.fees}
              </p>
            </div>
            <button
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                background: "#4a6cf7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Login as {doctor.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorLoginCards;