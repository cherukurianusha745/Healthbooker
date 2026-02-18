// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "../styles/doctor-dashboard.css";

// axios.defaults.baseURL = "http://localhost:5002/api";

// const DoctorDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("new");
//   const [appointments, setAppointments] = useState([]);
//   const [doctorProfile, setDoctorProfile] = useState(null);
//   const [loading, setLoading] = useState({
//     appointments: false,
//     profile: false
//   });

//   // Log current user
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     console.log("👤 CURRENT LOGGED IN DOCTOR:", user);
//   }, []);

//   // Fetch doctor appointments
//   const fetchDoctorAppointments = useCallback(async () => {
//     try {
//       setLoading(prev => ({ ...prev, appointments: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/appointment/doctor-appointments", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("✅ Appointments received:", response.data);
//       setAppointments(response.data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(prev => ({ ...prev, appointments: false }));
//     }
//   }, []);

//   // Fetch doctor profile
//   const fetchDoctorProfile = useCallback(async () => {
//     try {
//       setLoading(prev => ({ ...prev, profile: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/doctors/get-doctor-profile", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDoctorProfile(response.data);
//     } catch (error) {
//       console.error("Error fetching doctor profile:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, profile: false }));
//     }
//   }, []);

//   // Combined fetch function
//   const fetchDoctorData = useCallback(async () => {
//     await Promise.all([
//       fetchDoctorAppointments(),
//       fetchDoctorProfile()
//     ]);
//   }, [fetchDoctorAppointments, fetchDoctorProfile]);

//   // Check authentication and fetch data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user.role !== "doctor") {
//       toast.error("Access denied. Doctors only.");
//       navigate("/");
//       return;
//     }

//     fetchDoctorData();
//   }, [navigate, fetchDoctorData]);

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   // ============ FIXED: CONFIRM APPOINTMENT ============
//   const handleConfirmAppointment = async (appointmentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔍 Confirming appointment:", appointmentId);
      
//       // USE PUT instead of POST
//       await axios.put(
//         `/appointment/confirm/${appointmentId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       toast.success("✅ Appointment confirmed successfully");
//       fetchDoctorAppointments(); // Refresh the list
//     } catch (error) {
//       console.error("Confirm error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to confirm appointment");
//     }
//   };

//   // ============ FIXED: COMPLETE APPOINTMENT ============
//   const handleCompleteAppointment = async (appointmentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔍 Completing appointment:", appointmentId);
      
//       // USE the correct endpoint: /appointment/complete/:id
//       await axios.put(
//         `/appointment/complete/${appointmentId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       toast.success("✅ Appointment completed successfully");
//       fetchDoctorAppointments(); // Refresh the list
//     } catch (error) {
//       console.error("Complete error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to complete appointment");
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Filter appointments by status
//   const newAppointments = appointments.filter(a => a.status === "approved");
//   const confirmedAppointments = appointments.filter(a => a.status === "confirmed");
//   const completedAppointments = appointments.filter(a => a.status === "completed");

//   return (
//     <div className="doctor-dashboard">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Doctor Dashboard</h1>
//           {doctorProfile && (
//             <p>{doctorProfile.specialization} • {doctorProfile.experience} years experience</p>
//           )}
//         </div>
        
//         {/* Logout Button */}
//         <button className="logout-btn" onClick={handleLogout}>
//           <span className="icon">🚪</span>
//           Logout
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <div className="stat-card" onClick={() => setActiveTab("new")}>
//           <div className="stat-icon">🆕</div>
//           <div className="stat-info">
//             <h3>New Requests</h3>
//             <p className="stat-number">{newAppointments.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("confirmed")}>
//           <div className="stat-icon">✅</div>
//           <div className="stat-info">
//             <h3>Confirmed</h3>
//             <p className="stat-number">{confirmedAppointments.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("completed")}>
//           <div className="stat-icon">✓</div>
//           <div className="stat-info">
//             <h3>Completed</h3>
//             <p className="stat-number">{completedAppointments.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("profile")}>
//           <div className="stat-icon">👤</div>
//           <div className="stat-info">
//             <h3>My Profile</h3>
//             <p className="stat-number">View</p>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="tab-navigation">
//         <button 
//           className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
//           onClick={() => setActiveTab('new')}
//         >
//           New Requests
//           {newAppointments.length > 0 && <span className="badge">{newAppointments.length}</span>}
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
//           onClick={() => setActiveTab('confirmed')}
//         >
//           Confirmed
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
//           onClick={() => setActiveTab('completed')}
//         >
//           Completed
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
//           onClick={() => setActiveTab('profile')}
//         >
//           My Profile
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {/* New Appointments Tab */}
//         {activeTab === 'new' && (
//           <div className="table-container">
//             <h2>New Appointment Requests (From Admin)</h2>
//             {loading.appointments ? (
//               <div className="loading">Loading appointments...</div>
//             ) : newAppointments.length === 0 ? (
//               <div className="empty-state">
//                 <p>No new appointment requests</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Email</th>
//                     <th>Mobile</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Booked On</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {newAppointments.map((app) => (
//                     <tr key={app._id}>
//                       <td>{app.patientId?.firstname} {app.patientId?.lastname}</td>
//                       <td>{app.patientId?.email}</td>
//                       <td>{app.patientId?.mobile || 'N/A'}</td>
//                       <td>{app.date}</td>
//                       <td>{app.time}</td>
//                       <td>{formatDate(app.createdAt)}</td>
//                       <td>
//                         <button 
//                           className="btn-confirm"
//                           onClick={() => handleConfirmAppointment(app._id)}
//                         >
//                           Confirm Appointment
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* Confirmed Appointments Tab */}
//         {activeTab === 'confirmed' && (
//           <div className="table-container">
//             <h2>Confirmed Appointments</h2>
//             {loading.appointments ? (
//               <div className="loading">Loading appointments...</div>
//             ) : confirmedAppointments.length === 0 ? (
//               <div className="empty-state">
//                 <p>No confirmed appointments</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Email</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Confirmed On</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {confirmedAppointments.map((app) => (
//                     <tr key={app._id}>
//                       <td>{app.patientId?.firstname} {app.patientId?.lastname}</td>
//                       <td>{app.patientId?.email}</td>
//                       <td>{app.date}</td>
//                       <td>{app.time}</td>
//                       <td>{formatDate(app.updatedAt)}</td>
//                       <td>
//                         <button 
//                           className="btn-complete"
//                           onClick={() => handleCompleteAppointment(app._id)}
//                         >
//                           Mark Completed
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* Completed Appointments Tab */}
//         {activeTab === 'completed' && (
//           <div className="table-container">
//             <h2>Completed Appointments</h2>
//             {loading.appointments ? (
//               <div className="loading">Loading appointments...</div>
//             ) : completedAppointments.length === 0 ? (
//               <div className="empty-state">
//                 <p>No completed appointments</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Completed On</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {completedAppointments.map((app) => (
//                     <tr key={app._id}>
//                       <td>{app.patientId?.firstname} {app.patientId?.lastname}</td>
//                       <td>{app.date}</td>
//                       <td>{app.time}</td>
//                       <td>{formatDate(app.updatedAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeTab === 'profile' && (
//           <div className="profile-container">
//             <h2>My Profile</h2>
//             {loading.profile ? (
//               <div className="loading">Loading profile...</div>
//             ) : doctorProfile ? (
//               <div className="profile-card">
//                 <div className="profile-header">
//                   <div className="profile-avatar">
//                     {doctorProfile.userId?.firstname?.charAt(0)}
//                   </div>
//                   <div className="profile-info">
//                     <h3>Dr. {doctorProfile.userId?.firstname} {doctorProfile.userId?.lastname}</h3>
//                     <p className="specialty">{doctorProfile.specialization}</p>
//                   </div>
//                 </div>
//                 <div className="profile-details">
//                   <p><strong>Email:</strong> {doctorProfile.userId?.email}</p>
//                   <p><strong>Experience:</strong> {doctorProfile.experience} years</p>
//                   <p><strong>Consultation Fee:</strong> ${doctorProfile.fees}</p>
//                   <p><strong>Member Since:</strong> {formatDate(doctorProfile.createdAt)}</p>
//                 </div>
//               </div>
//             ) : (
//               <p>Profile not found</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/doctor-dashboard.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState({
    appointments: false,
    profile: false
  });

  // Fetch doctor appointments
  const fetchDoctorAppointments = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, appointments: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointment/doctor-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Appointments received:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  }, []);

  // Fetch doctor profile
  const fetchDoctorProfile = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/get-doctor-profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctorProfile(response.data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, []);

  // Combined fetch function
  const fetchDoctorData = useCallback(async () => {
    await Promise.all([
      fetchDoctorAppointments(),
      fetchDoctorProfile()
    ]);
  }, [fetchDoctorAppointments, fetchDoctorProfile]);

  // Check authentication and fetch data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "doctor") {
      toast.error("Access denied. Doctors only.");
      navigate("/");
      return;
    }

    fetchDoctorData();
  }, [navigate, fetchDoctorData]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ============ CONFIRM APPOINTMENT ============
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Confirming appointment:", appointmentId);
      
      const response = await axios.post(
        `/appointment/confirm/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ Confirm response:", response.data);
      toast.success("✅ Appointment confirmed successfully");
      fetchDoctorAppointments();
    } catch (error) {
      console.error("❌ Confirm error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to confirm appointment");
    }
  };

  // ============ COMPLETE APPOINTMENT ============
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Completing appointment:", appointmentId);
      
      const response = await axios.put(
        "/appointment/completed",
        { appointid: appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ Complete response:", response.data);
      toast.success("✅ Appointment completed successfully");
      fetchDoctorAppointments();
    } catch (error) {
      console.error("❌ Complete error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    }
  };

  // ============ FORMAT DATE ============
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============ GET STATUS BADGE ============
  const getStatusBadge = (status) => {
    const badges = {
      pending: "status-pending",
      approved: "status-approved",
      confirmed: "status-confirmed",
      completed: "status-completed"
    };
    return badges[status] || "status-pending";
  };

  // Filter appointments by status
  const pendingAppointments = appointments.filter(a => a.status === "approved");
  const confirmedAppointments = appointments.filter(a => a.status === "confirmed");
  const completedAppointments = appointments.filter(a => a.status === "completed");

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Doctor Dashboard</h1>
          {doctorProfile && (
            <div className="doctor-info">
              <p className="specialization">{doctorProfile.specialization}</p>
              <p className="experience">{doctorProfile.experience} years experience</p>
              <p className="fees">Consultation Fee: ${doctorProfile.fees}</p>
            </div>
          )}
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveTab("pending")}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Confirmation</h3>
            <p className="stat-number">{pendingAppointments.length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("confirmed")}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Confirmed</h3>
            <p className="stat-number">{confirmedAppointments.length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("completed")}>
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-number">{completedAppointments.length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("profile")}>
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>My Profile</h3>
            <p className="stat-number">View</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Confirmation
          {pendingAppointments.length > 0 && <span className="badge">{pendingAppointments.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed
          {confirmedAppointments.length > 0 && <span className="badge">{confirmedAppointments.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Pending Appointments Tab */}
        {activeTab === 'pending' && (
          <div className="table-container">
            <h2>Appointments Pending Your Confirmation</h2>
            <p className="tab-description">These appointments have been approved by admin and need your confirmation</p>
            {loading.appointments ? (
              <div className="loading">Loading appointments...</div>
            ) : pendingAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments pending confirmation</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Booked On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppointments.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.patientId?.firstname} {app.patientId?.lastname}</strong>
                      </td>
                      <td>{app.patientId?.email}</td>
                      <td>{app.patientId?.mobile || 'N/A'}</td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(app.status)}`}>
                          {app.status === "approved" ? "Awaiting Your Confirmation" : app.status}
                        </span>
                      </td>
                      <td>{formatDate(app.createdAt)}</td>
                      <td>
                        <button 
                          className="btn-confirm"
                          onClick={() => handleConfirmAppointment(app._id)}
                        >
                          Confirm Appointment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Confirmed Appointments Tab */}
        {activeTab === 'confirmed' && (
          <div className="table-container">
            <h2>Confirmed Appointments</h2>
            <p className="tab-description">Appointments you have confirmed</p>
            {loading.appointments ? (
              <div className="loading">Loading appointments...</div>
            ) : confirmedAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No confirmed appointments</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Confirmed On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedAppointments.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.patientId?.firstname} {app.patientId?.lastname}</strong>
                      </td>
                      <td>{app.patientId?.email}</td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(app.status)}`}>
                          Confirmed
                        </span>
                      </td>
                      <td>{formatDate(app.updatedAt)}</td>
                      <td>
                        <button 
                          className="btn-complete"
                          onClick={() => handleCompleteAppointment(app._id)}
                        >
                          Mark Completed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Completed Appointments Tab */}
        {activeTab === 'completed' && (
          <div className="table-container">
            <h2>Completed Appointments</h2>
            {loading.appointments ? (
              <div className="loading">Loading appointments...</div>
            ) : completedAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No completed appointments</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Completed On</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAppointments.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.patientId?.firstname} {app.patientId?.lastname}</strong>
                      </td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(app.status)}`}>
                          Completed
                        </span>
                      </td>
                      <td>{formatDate(app.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-container">
            <h2>My Profile</h2>
            {loading.profile ? (
              <div className="loading">Loading profile...</div>
            ) : doctorProfile ? (
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {doctorProfile.userId?.firstname?.charAt(0) || 'D'}
                  </div>
                  <div className="profile-info">
                    <h3>Dr. {doctorProfile.userId?.firstname} {doctorProfile.userId?.lastname}</h3>
                    <p className="specialty">{doctorProfile.specialization}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <p><strong>Email:</strong> {doctorProfile.userId?.email}</p>
                  <p><strong>Experience:</strong> {doctorProfile.experience} years</p>
                  <p><strong>Consultation Fee:</strong> ${doctorProfile.fees}</p>
                  <p><strong>Member Since:</strong> {formatDate(doctorProfile.createdAt)}</p>
                </div>
              </div>
            ) : (
              <p>Profile not found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;