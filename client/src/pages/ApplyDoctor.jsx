import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../styles/doctorapply.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5002/api"; // Use your actual backend URL

function DoctorApply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
    timing: "morning", // Changed from "Timing" to a valid default
  });

  // Get user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userData._id) {
        toast.error("User data not found");
        navigate("/login");
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { specialization, experience, fees, timing } = formDetails;

      // Validate inputs
      if (!specialization || !experience || !fees || !timing) {
        return toast.error("All fields are required");
      }

      // Validate experience is a number
      if (isNaN(experience) || Number(experience) <= 0) {
        return toast.error("Please enter valid years of experience");
      }

      // Validate fees is a number
      if (isNaN(fees) || Number(fees) <= 0) {
        return toast.error("Please enter valid consultation fees");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Please login again");
      }

      setLoading(true);

      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!userData._id) {
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        return;
      }

      // Make the API call with correct endpoint
      const response = await axios.post(
        "/doctors/apply-for-doctor", // Try this endpoint
        {
          userId: userData._id, // Send user ID
          specialization,
          experience: Number(experience),
          fees: Number(fees),
          timing,
          status: "pending"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.data.success) {
        toast.success("Application submitted successfully! Waiting for admin approval.");
        // Clear form
        setFormDetails({
          specialization: "",
          experience: "",
          fees: "",
          timing: "morning",
        });
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/patient-dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to submit application");
      }
      
    } catch (error) {
      console.error("Error submitting application:", error);
      
      // Better error messages
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data.message || "Server error. Please try again.");
      } else if (error.request) {
        // Request made but no response
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        // Something else happened
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="apply-doctor-section flex-center">
      <div className="apply-doctor-container flex-center">
        <h2 className="form-heading">Apply For Doctor</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="specialization"
            className="form-input"
            placeholder="Enter your specialization (e.g., Cardiologist)"
            value={formDetails.specialization}
            onChange={inputChange}
            required
          />
          
          <input
            type="number"
            name="experience"
            className="form-input"
            placeholder="Years of experience"
            value={formDetails.experience}
            onChange={inputChange}
            min="0"
            step="1"
            required
          />
          
          <input
            type="number"
            name="fees"
            className="form-input"
            placeholder="Consultation fees (in rupees)"
            value={formDetails.fees}
            onChange={inputChange}
            min="0"
            step="100"
            required
          />
          
          <select
            name="timing"
            value={formDetails.timing}
            className="form-input"
            onChange={inputChange}
            required
          >
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
            <option value="evening">Evening (3 PM - 6 PM)</option>
            <option value="night">Night (6 PM - 9 PM)</option>
          </select>

          <button 
            type="submit" 
            className="btn form-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Apply as Doctor"}
          </button>
        </form>

        {/* Display user info */}
        {user && (
          <div className="user-info">
            <p>Applying as: {user.firstname} {user.lastname}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default DoctorApply;