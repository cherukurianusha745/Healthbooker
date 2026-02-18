// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../styles/appointments.css";

// // IMPORTANT: Set baseURL correctly
// axios.defaults.baseURL = "http://localhost:5002/api";

// const MyAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       console.log("1. Token from localStorage:", token ? "Present" : "Missing");
      
//       if (!token) {
//         toast.error("Please login first");
//         window.location.href = "/login";
//         return;
//       }

//       console.log("2. Making request to: /appointment/my-appointments");
      
//       // Make the request with proper headers
//       const response = await axios.get("/appointment/my-appointments", {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log("3. Response status:", response.status);
//       console.log("4. Response data:", response.data);
      
//       // Handle the response - your controller returns formatted appointments directly
//       if (Array.isArray(response.data)) {
//         setAppointments(response.data);
//         console.log(`5. Set ${response.data.length} appointments`);
//       } else {
//         console.log("5. Unexpected response format:", response.data);
//         setAppointments([]);
//       }
      
//     } catch (error) {
//       console.error("❌ ERROR DETAILS:");
//       console.error("Status:", error.response?.status);
//       console.error("Status Text:", error.response?.statusText);
//       console.error("Response Data:", error.response?.data);
//       console.error("Message:", error.message);
      
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       } else {
//         toast.error(error.response?.data?.message || "Failed to load appointments");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: { class: "badge-pending", text: "⏳ Pending" },
//       approved: { class: "badge-approved", text: "📋 Approved" },
//       confirmed: { class: "badge-confirmed", text: "✅ Confirmed" },
//       completed: { class: "badge-completed", text: "✓ Completed" },
//       rejected: { class: "badge-rejected", text: "✗ Rejected" },
//       cancelled: { class: "badge-cancelled", text: "✗ Cancelled" }
//     };
    
//     const badge = badges[status] || badges.pending;
//     return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading your appointments...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="appointments-container">
//       <h2>My Appointments</h2>
      
//       {appointments.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-icon">📅</div>
//           <h3>No Appointments Found</h3>
//           <p>You haven't booked any appointments yet.</p>
//           <button 
//             className="btn-book"
//             onClick={() => window.location.href = "/doctors"}
//           >
//             Book an Appointment
//           </button>
//         </div>
//       ) : (
//         <>
//           <p className="appointments-count">You have {appointments.length} appointment(s)</p>
//           <div className="appointments-grid">
//             {appointments.map((appointment) => (
//               <div key={appointment._id} className="appointment-card">
//                 <div className="card-header">
//                   <h3>{appointment.doctorName || "Doctor"}</h3>
//                   {getStatusBadge(appointment.status)}
//                 </div>
                
//                 <div className="card-body">
//                   <div className="detail-row">
//                     <span className="detail-label">Specialization:</span>
//                     <span className="detail-value">{appointment.specialization || "General"}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Date:</span>
//                     <span className="detail-value">{appointment.date}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Time:</span>
//                     <span className="detail-value">{appointment.time}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="detail-label">Booked on:</span>
//                     <span className="detail-value">
//                       {new Date(appointment.bookedOn).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="card-footer">
//                   {appointment.status === "pending" && (
//                     <p className="status-message pending">
//                       ⏳ Waiting for admin approval
//                     </p>
//                   )}
//                   {appointment.status === "approved" && (
//                     <p className="status-message approved">
//                       📋 Sent to doctor for confirmation
//                     </p>
//                   )}
//                   {appointment.status === "confirmed" && (
//                     <p className="status-message confirmed">
//                       ✅ Your appointment is confirmed
//                     </p>
//                   )}
//                   {appointment.status === "completed" && (
//                     <p className="status-message completed">
//                       ✓ Appointment completed
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MyAppointments;
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/my-appointments.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Log for debugging
      console.log("Fetching appointments with token:", token ? "Present" : "Missing");
      
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // Try both endpoints to see which one works
      // First try: /appointment/my-appointments (from your first version)
      try {
        const response = await axios.get("/appointment/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Response from /my-appointments:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && response.data.appointments) {
          setAppointments(response.data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (firstError) {
        console.log("First endpoint failed, trying second...");
        
        // Second try: /appointment/user-appointments
        const response = await axios.get("/appointment/user-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Response from /user-appointments:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && response.data.appointments) {
          setAppointments(response.data.appointments);
        } else {
          setAppointments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "status-pending", text: "⏳ Pending Admin Approval" },
      approved: { class: "status-approved", text: "📋 Sent to Doctor" },
      confirmed: { class: "status-confirmed", text: "✅ Confirmed by Doctor" },
      completed: { class: "status-completed", text: "✓ Completed" },
      cancelled: { class: "status-cancelled", text: "✗ Cancelled" }
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/appointment/cancel/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment cancelled successfully");
      fetchMyAppointments(); // Refresh the list
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }

  return (
    <div className="my-appointments-container">
      <div className="appointments-header">
        <h1>My Appointments</h1>
        <button className="book-new-btn" onClick={() => navigate("/book-appointment")}>
          + Book New Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any appointments yet</p>
          <button className="book-first-btn" onClick={() => navigate("/book-appointment")}>
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((app) => {
            const badge = getStatusBadge(app.status);
            return (
              <div key={app._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>
                    Dr. {app.doctorId?.userId?.firstname} {app.doctorId?.userId?.lastname}
                  </h3>
                  <span className={`status-badge ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>
                
                <div className="appointment-details">
                  <p><strong>Specialization:</strong> {app.doctorId?.specialization || "N/A"}</p>
                  <p><strong>Date:</strong> {app.date || "N/A"}</p>
                  <p><strong>Time:</strong> {app.time || "N/A"}</p>
                  <p><strong>Booked on:</strong> {formatDate(app.createdAt)}</p>
                </div>

                {app.status === "pending" && (
                  <div className="appointment-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancel(app._id)}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;