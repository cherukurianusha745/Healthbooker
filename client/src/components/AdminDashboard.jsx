import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    appointments: false,
    pendingDoctors: false,
    doctors: false,
    users: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchAppointments(),
      fetchPendingDoctors(),
      fetchDoctors(),
      fetchUsers()
    ]);
  };

  // ============ FETCH APPOINTMENTS ============
  const fetchAppointments = async () => {
    try {
      setLoading(prev => ({ ...prev, appointments: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointment/admin-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  // ============ FETCH PENDING DOCTORS ============
  const fetchPendingDoctors = async () => {
    try {
      setLoading(prev => ({ ...prev, pendingDoctors: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/get-pending-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDoctors(response.data);
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setLoading(prev => ({ ...prev, pendingDoctors: false }));
    }
  };

  // ============ FETCH ALL DOCTORS ============
  const fetchDoctors = async () => {
    try {
      setLoading(prev => ({ ...prev, doctors: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/get-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(prev => ({ ...prev, doctors: false }));
    }
  };

  // ============ FETCH ALL USERS ============
  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const token = localStorage.getItem("token");
      const response = await axios.get("/users/getallusers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // ============ APPROVE APPOINTMENT ============
  const handleApproveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/appointment/approve/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Appointment approved and sent to doctor");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to approve appointment");
    }
  };

  // ============ APPROVE DOCTOR ============
  const handleApproveDoctor = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/doctors/acceptdoctor",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Doctor application approved");
      fetchPendingDoctors();
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to approve doctor");
    }
  };

  // ============ REJECT DOCTOR ============
  const handleRejectDoctor = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/doctors/rejectdoctor",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("❌ Doctor application rejected");
      fetchPendingDoctors();
    } catch (error) {
      toast.error("Failed to reject doctor");
    }
  };

  // ============ FORMAT DATE ============
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage appointments, doctors, and users</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveTab("appointments")}>
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Pending Appointments</h3>
            <p className="stat-number">{appointments.filter(a => a.status === "pending").length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("applications")}>
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>Doctor Applications</h3>
            <p className="stat-number">{pendingDoctors.length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("doctors")}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Approved Doctors</h3>
            <p className="stat-number">{doctors.length}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab("users")}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
          {appointments.filter(a => a.status === "pending").length > 0 && 
            <span className="badge">{appointments.filter(a => a.status === "pending").length}</span>
          }
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Doctor Applications
          {pendingDoctors.length > 0 && <span className="badge">{pendingDoctors.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* ============ APPOINTMENTS TAB ============ */}
        {activeTab === 'appointments' && (
          <div className="table-container">
            <h2>All Appointments</h2>
            {loading.appointments ? (
              <div className="loading">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments found</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id}>
                      <td>{app.patientId?.firstname} {app.patientId?.lastname}</td>
                      <td>Dr. {app.doctorId?.userId?.firstname} {app.doctorId?.userId?.lastname}</td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        <span className={`status-${app.status}`}>{app.status}</span>
                      </td>
                      <td>
                        {app.status === "pending" && (
                          <button 
                            className="btn-approve"
                            onClick={() => handleApproveAppointment(app._id)}
                          >
                            Approve & Send to Doctor
                          </button>
                        )}
                        {app.status === "confirmed" && (
                          <span className="status-confirmed">Confirmed by Doctor</span>
                        )}
                        {app.status === "completed" && (
                          <span className="status-completed">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ============ DOCTOR APPLICATIONS TAB ============ */}
        {activeTab === 'applications' && (
          <div className="table-container">
            <h2>Pending Doctor Applications</h2>
            {loading.pendingDoctors ? (
              <div className="loading">Loading applications...</div>
            ) : pendingDoctors.length === 0 ? (
              <div className="empty-state">
                <p>No pending applications</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fees</th>
                    <th>Applied On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDoctors.map((doc) => (
                    <tr key={doc._id}>
                      <td>{doc.userId?.firstname} {doc.userId?.lastname}</td>
                      <td>{doc.userId?.email}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.experience} years</td>
                      <td>${doc.fees}</td>
                      <td>{formatDate(doc.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-approve"
                            onClick={() => handleApproveDoctor(doc.userId?._id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => handleRejectDoctor(doc.userId?._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ============ DOCTORS TAB ============ */}
        {activeTab === 'doctors' && (
          <div className="table-container">
            <h2>Approved Doctors</h2>
            {loading.doctors ? (
              <div className="loading">Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div className="empty-state">
                <p>No doctors found</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fees</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id}>
                      <td>{doc.name}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.experience} years</td>
                      <td>${doc.fees}</td>
                      <td><span className="status-active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ============ USERS TAB ============ */}
        {activeTab === 'users' && (
          <div className="table-container">
            <h2>All Users</h2>
            {loading.users ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <p>No users found</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Mobile</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstname} {user.lastname}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-${user.role}`}>{user.role}</span>
                      </td>
                      <td>{user.mobile || 'N/A'}</td>
                      <td>{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";

// axios.defaults.baseURL = "http://localhost:5002/api";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("appointments");
//   const [appointments, setAppointments] = useState([]);
//   const [pendingDoctors, setPendingDoctors] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState({
//     appointments: false,
//     pendingDoctors: false,
//     doctors: false,
//     users: false
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     await Promise.all([
//       fetchAppointments(),
//       fetchPendingDoctors(),
//       fetchDoctors(),
//       fetchUsers()
//     ]);
//   };

//   // ============ FETCH APPOINTMENTS ============
//   const fetchAppointments = async () => {
//     try {
//       setLoading(prev => ({ ...prev, appointments: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/appointment/admin-appointments", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAppointments(response.data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(prev => ({ ...prev, appointments: false }));
//     }
//   };

//   // ============ FETCH PENDING DOCTORS ============
//   const fetchPendingDoctors = async () => {
//     try {
//       setLoading(prev => ({ ...prev, pendingDoctors: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/doctors/get-pending-doctors", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPendingDoctors(response.data);
//     } catch (error) {
//       console.error("Error fetching pending doctors:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, pendingDoctors: false }));
//     }
//   };

//   // ============ FETCH ALL DOCTORS ============
//   const fetchDoctors = async () => {
//     try {
//       setLoading(prev => ({ ...prev, doctors: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/doctors/get-doctors", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDoctors(response.data);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, doctors: false }));
//     }
//   };

//   // ============ FETCH ALL USERS ============
//   const fetchUsers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, users: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/users/getallusers", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, users: false }));
//     }
//   };

//   // ============ APPROVE APPOINTMENT ============
//   const handleApproveAppointment = async (appointmentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `/appointment/approve/${appointmentId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("✅ Appointment approved and sent to doctor");
//       fetchAppointments();
//     } catch (error) {
//       console.error("Approve error:", error);
//       toast.error(error.response?.data?.message || "Failed to approve appointment");
//     }
//   };

//   // ============ APPROVE DOCTOR ============
//   const handleApproveDoctor = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/doctors/acceptdoctor",
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("✅ Doctor application approved");
//       fetchPendingDoctors();
//       fetchDoctors();
//     } catch (error) {
//       toast.error("Failed to approve doctor");
//     }
//   };

//   // ============ REJECT DOCTOR ============
//   const handleRejectDoctor = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/doctors/rejectdoctor",
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("❌ Doctor application rejected");
//       fetchPendingDoctors();
//     } catch (error) {
//       toast.error("Failed to reject doctor");
//     }
//   };

//   // ============ FORMAT DATE ============
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

//   // ============ GET STATUS BADGE ============
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: { class: "status-pending", text: "⏳ Pending" },
//       approved: { class: "status-approved", text: "📋 Approved" },
//       confirmed: { class: "status-confirmed", text: "✅ Confirmed" },
//       completed: { class: "status-completed", text: "✓ Completed" },
//       rejected: { class: "status-rejected", text: "✗ Rejected" }
//     };
//     return badges[status] || badges.pending;
//   };

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-header">
//         <h1>Admin Dashboard</h1>
//         <p>Manage appointments, doctors, and users</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <div className="stat-card" onClick={() => setActiveTab("appointments")}>
//           <div className="stat-icon">📅</div>
//           <div className="stat-info">
//             <h3>Pending Appointments</h3>
//             <p className="stat-number">{appointments.filter(a => a.status === "pending").length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("applications")}>
//           <div className="stat-icon">👨‍⚕️</div>
//           <div className="stat-info">
//             <h3>Doctor Applications</h3>
//             <p className="stat-number">{pendingDoctors.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("doctors")}>
//           <div className="stat-icon">✅</div>
//           <div className="stat-info">
//             <h3>Approved Doctors</h3>
//             <p className="stat-number">{doctors.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("users")}>
//           <div className="stat-icon">👥</div>
//           <div className="stat-info">
//             <h3>Total Users</h3>
//             <p className="stat-number">{users.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="tab-navigation">
//         <button 
//           className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('appointments')}
//         >
//           Appointments
//           {appointments.filter(a => a.status === "pending").length > 0 && 
//             <span className="badge">{appointments.filter(a => a.status === "pending").length}</span>
//           }
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
//           onClick={() => setActiveTab('applications')}
//         >
//           Doctor Applications
//           {pendingDoctors.length > 0 && <span className="badge">{pendingDoctors.length}</span>}
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
//           onClick={() => setActiveTab('doctors')}
//         >
//           Doctors
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
//           onClick={() => setActiveTab('users')}
//         >
//           Users
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {/* ============ APPOINTMENTS TAB ============ */}
//         {activeTab === 'appointments' && (
//           <div className="table-container">
//             <div className="table-header">
//               <h2>All Appointments</h2>
//               <button className="btn-refresh" onClick={fetchAppointments}>
//                 ⟳ Refresh
//               </button>
//             </div>

//             {/* Stats Summary */}
//             <div className="appointment-stats">
//               <div className="stat-item">
//                 <span className="stat-label">Total:</span>
//                 <span className="stat-value">{appointments.length}</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-label pending">Pending:</span>
//                 <span className="stat-value">{appointments.filter(a => a.status === 'pending').length}</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-label approved">Approved:</span>
//                 <span className="stat-value">{appointments.filter(a => a.status === 'approved').length}</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-label confirmed">Confirmed:</span>
//                 <span className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</span>
//               </div>
//             </div>

//             {loading.appointments ? (
//               <div className="loading">Loading appointments...</div>
//             ) : appointments.length === 0 ? (
//               <div className="empty-state">
//                 <p>No appointments found</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((app) => {
//                     const badge = getStatusBadge(app.status);
//                     return (
//                       <tr key={app._id}>
//                         <td>
//                           <div className="patient-info">
//                             <strong>{app.patientId?.firstname} {app.patientId?.lastname}</strong>
//                             <br />
//                             <small>{app.patientId?.email}</small>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="doctor-info">
//                             <strong>Dr. {app.doctorId?.userId?.firstname} {app.doctorId?.userId?.lastname}</strong>
//                             <br />
//                             <small>{app.doctorId?.specialization}</small>
//                           </div>
//                         </td>
//                         <td>{app.date}</td>
//                         <td>{app.time}</td>
//                         <td>
//                           <span className={`status-badge ${badge.class}`}>
//                             {badge.text}
//                           </span>
//                         </td>
//                         <td>
//                           {app.status === "pending" && (
//                             <button 
//                               className="btn-approve"
//                               onClick={() => handleApproveAppointment(app._id)}
//                             >
//                               ✓ Approve & Send to Doctor
//                             </button>
//                           )}
//                           {app.status === "approved" && (
//                             <span className="status-message">
//                               ⏳ Waiting for doctor
//                             </span>
//                           )}
//                           {app.status === "confirmed" && (
//                             <span className="status-message confirmed">
//                               ✅ Confirmed by Doctor
//                             </span>
//                           )}
//                           {app.status === "completed" && (
//                             <span className="status-message completed">
//                               ✓ Completed
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ DOCTOR APPLICATIONS TAB ============ */}
//         {activeTab === 'applications' && (
//           <div className="table-container">
//             <h2>Pending Doctor Applications</h2>
//             {loading.pendingDoctors ? (
//               <div className="loading">Loading applications...</div>
//             ) : pendingDoctors.length === 0 ? (
//               <div className="empty-state">
//                 <p>No pending applications</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Specialization</th>
//                     <th>Experience</th>
//                     <th>Fees</th>
//                     <th>Applied On</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingDoctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td>{doc.userId?.firstname} {doc.userId?.lastname}</td>
//                       <td>{doc.userId?.email}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.experience} years</td>
//                       <td>${doc.fees}</td>
//                       <td>{formatDate(doc.createdAt)}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             className="btn-approve"
//                             onClick={() => handleApproveDoctor(doc.userId?._id)}
//                           >
//                             Approve
//                           </button>
//                           <button 
//                             className="btn-reject"
//                             onClick={() => handleRejectDoctor(doc.userId?._id)}
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ DOCTORS TAB ============ */}
//         {activeTab === 'doctors' && (
//           <div className="table-container">
//             <h2>Approved Doctors</h2>
//             {loading.doctors ? (
//               <div className="loading">Loading doctors...</div>
//             ) : doctors.length === 0 ? (
//               <div className="empty-state">
//                 <p>No doctors found</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Specialization</th>
//                     <th>Experience</th>
//                     <th>Fees</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td>{doc.name}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.experience} years</td>
//                       <td>${doc.fees}</td>
//                       <td><span className="status-active">Active</span></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ USERS TAB ============ */}
//         {activeTab === 'users' && (
//           <div className="table-container">
//             <h2>All Users</h2>
//             {loading.users ? (
//               <div className="loading">Loading users...</div>
//             ) : users.length === 0 ? (
//               <div className="empty-state">
//                 <p>No users found</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Mobile</th>
//                     <th>Joined</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user._id}>
//                       <td>{user.firstname} {user.lastname}</td>
//                       <td>{user.email}</td>
//                       <td>
//                         <span className={`role-${user.role}`}>{user.role}</span>
//                       </td>
//                       <td>{user.mobile || 'N/A'}</td>
//                       <td>{formatDate(user.createdAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";

// axios.defaults.baseURL = "http://localhost:5002/api";
// // Add this button in your header
// <button 
//   onClick={async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/appointment/test-admin", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("TEST RESPONSE:", response.data);
//       toast.success(`Found ${response.data.count} appointments`);
//     } catch (error) {
//       console.error("TEST ERROR:", error);
//       toast.error(error.message);
//     }
//   }}
//   style={{ marginLeft: '10px', padding: '5px 10px' }}
// >
//   Test API
// </button>
// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("appointments");
//   const [appointments, setAppointments] = useState([]);
//   const [pendingDoctors, setPendingDoctors] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState({
//     appointments: false,
//     pendingDoctors: false,
//     doctors: false,
//     users: false
//   });
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//  useEffect(() => {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
  
//   console.log("===== ADMIN DASHBOARD DEBUG =====");
//   console.log("Token:", token);
//   console.log("User from localStorage:", user);
//   console.log("User role:", user.role);
//   console.log("Is admin:", user.role === "admin" || user.isAdmin);
  
//   if (!token) {
//     console.log("No token, redirecting to login");
//     navigate("/login");
//     return;
//   }

//   if (user.role !== "admin" && !user.isAdmin) {
//     console.log("User is not admin, redirecting");
//     toast.error("Access denied. Admin only.");
//     navigate("/");
//     return;
//   }

//   console.log("Admin verified, fetching data...");
//   fetchAllData();
// }, [navigate]);
//   // ============ FETCH APPOINTMENTS ============
//   // ============ FETCH APPOINTMENTS ============
// const fetchAppointments = async () => {
//   try {
//     setLoading(prev => ({ ...prev, appointments: true }));
//     const token = localStorage.getItem("token");
    
//     console.log("🔍 Fetching appointments...");
//     console.log("Token:", token ? "Token exists" : "No token");
    
//     // First, let's test with a simple request
//     const response = await axios.get("/appointment/admin-appointments", {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log("✅ Full response:", response);
//     console.log("✅ Response data:", response.data);
//     console.log("✅ Number of appointments:", response.data.length);
    
//     if (response.data && Array.isArray(response.data)) {
//       setAppointments(response.data);
      
//       // Log each appointment for debugging
//       response.data.forEach((app, index) => {
//         console.log(`Appointment ${index + 1}:`, {
//           id: app._id,
//           status: app.status,
//           patient: app.patientId?.firstname,
//           doctor: app.doctorId?.userId?.firstname
//         });
//       });
//     } else {
//       console.log("❌ Response data is not an array:", response.data);
//       setAppointments([]);
//     }
    
//   } catch (error) {
//     console.error("❌ Error fetching appointments:");
//     console.error("Error message:", error.message);
//     console.error("Error response:", error.response?.data);
//     console.error("Error status:", error.response?.status);
//     console.error("Error headers:", error.response?.headers);
    
//     if (error.response?.status === 403) {
//       toast.error("You don't have permission to view appointments");
//     } else if (error.response?.status === 401) {
//       toast.error("Session expired. Please login again");
//       navigate("/login");
//     } else {
//       toast.error("Failed to load appointments: " + (error.response?.data?.message || error.message));
//     }
//   } finally {
//     setLoading(prev => ({ ...prev, appointments: false }));
//   }
// };

//   // ============ FETCH PENDING DOCTORS ============
//   const fetchPendingDoctors = async () => {
//     try {
//       setLoading(prev => ({ ...prev, pendingDoctors: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/doctors/get-pending-doctors", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("✅ Pending doctors received:", response.data);
//       setPendingDoctors(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching pending doctors:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, pendingDoctors: false }));
//     }
//   };

//   // ============ FETCH ALL DOCTORS ============
//   const fetchDoctors = async () => {
//     try {
//       setLoading(prev => ({ ...prev, doctors: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/doctors/get-doctors", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("✅ Doctors received:", response.data);
//       setDoctors(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching doctors:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, doctors: false }));
//     }
//   };

//   // ============ FETCH ALL USERS ============
//   const fetchUsers = async () => {
//     try {
//       setLoading(prev => ({ ...prev, users: true }));
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/users/getallusers", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("✅ Users received:", response.data);
//       setUsers(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching users:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, users: false }));
//     }
//   };

//   // ============ APPROVE APPOINTMENT ============
//   const handleApproveAppointment = async (appointmentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔍 Approving appointment:", appointmentId);
      
//       const response = await axios.post(
//         `/appointment/approve/${appointmentId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("✅ Approve response:", response.data);
//       toast.success("✅ Appointment approved and sent to doctor");
      
//       // Refresh appointments
//       fetchAppointments();
      
//     } catch (error) {
//       console.error("❌ Approve error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to approve appointment");
//     }
//   };

//   // ============ APPROVE DOCTOR ============
//   const handleApproveDoctor = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔍 Approving doctor:", userId);
      
//       const response = await axios.post(
//         "/doctors/acceptdoctor",
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("✅ Doctor approve response:", response.data);
//       toast.success("✅ Doctor application approved");
      
//       // Refresh data
//       fetchPendingDoctors();
//       fetchDoctors();
      
//     } catch (error) {
//       console.error("❌ Approve doctor error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to approve doctor");
//     }
//   };

//   // ============ REJECT DOCTOR ============
//   const handleRejectDoctor = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔍 Rejecting doctor:", userId);
      
//       const response = await axios.post(
//         "/doctors/rejectdoctor",
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log("✅ Doctor reject response:", response.data);
//       toast.success("❌ Doctor application rejected");
      
//       // Refresh pending doctors
//       fetchPendingDoctors();
      
//     } catch (error) {
//       console.error("❌ Reject doctor error:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Failed to reject doctor");
//     }
//   };

//   // ============ FORMAT DATE ============
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // ============ FORMAT APPOINTMENT DATE ============
//   const formatAppointmentDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return dateString; // Return as is since it's stored as string
//   };

//   // ============ GET STATUS BADGE ============
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: { class: "status-pending", text: "⏳ Pending Admin Approval" },
//       approved: { class: "status-approved", text: "📋 Sent to Doctor" },
//       confirmed: { class: "status-confirmed", text: "✅ Confirmed by Doctor" },
//       completed: { class: "status-completed", text: "✓ Completed" },
//       cancelled: { class: "status-cancelled", text: "✗ Cancelled" }
//     };
//     return badges[status] || badges.pending;
//   };

//   // Manual refresh function
//   const handleRefresh = () => {
//     setRefreshTrigger(prev => prev + 1);
//     toast.success("Refreshing data...");
//   };

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   // Calculate stats
//   const pendingAppointments = appointments.filter(a => a.status === "pending").length;
//   const approvedAppointments = appointments.filter(a => a.status === "approved").length;
//   const confirmedAppointments = appointments.filter(a => a.status === "confirmed").length;
//   const completedAppointments = appointments.filter(a => a.status === "completed").length;

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <h1>Admin Dashboard</h1>
//           <p>Manage appointments, doctors, and users</p>
//         </div>
//         <div className="header-actions">
//           <button className="refresh-btn" onClick={handleRefresh}>
//             🔄 Refresh
//           </button>
//           <button className="logout-btn" onClick={handleLogout}>
//             <span className="icon">🚪</span>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <div className="stat-card" onClick={() => setActiveTab("appointments")}>
//           <div className="stat-icon">📅</div>
//           <div className="stat-info">
//             <h3>Pending Approvals</h3>
//             <p className="stat-number">{pendingAppointments}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("applications")}>
//           <div className="stat-icon">👨‍⚕️</div>
//           <div className="stat-info">
//             <h3>Doctor Applications</h3>
//             <p className="stat-number">{pendingDoctors.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("doctors")}>
//           <div className="stat-icon">✅</div>
//           <div className="stat-info">
//             <h3>Approved Doctors</h3>
//             <p className="stat-number">{doctors.length}</p>
//           </div>
//         </div>
//         <div className="stat-card" onClick={() => setActiveTab("users")}>
//           <div className="stat-icon">👥</div>
//           <div className="stat-info">
//             <h3>Total Users</h3>
//             <p className="stat-number">{users.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="tab-navigation">
//         <button 
//           className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('appointments')}
//         >
//           Appointments
//           {pendingAppointments > 0 && 
//             <span className="badge">{pendingAppointments}</span>
//           }
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
//           onClick={() => setActiveTab('applications')}
//         >
//           Doctor Applications
//           {pendingDoctors.length > 0 && <span className="badge">{pendingDoctors.length}</span>}
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
//           onClick={() => setActiveTab('doctors')}
//         >
//           Doctors
//         </button>
//         <button 
//           className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
//           onClick={() => setActiveTab('users')}
//         >
//           Users
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {/* ============ APPOINTMENTS TAB ============ */}
//         {activeTab === 'appointments' && (
//           <div className="table-container">
//             <div className="table-header">
//               <h2>All Appointments</h2>
//               <div className="appointment-summary">
//                 <span>Total: {appointments.length}</span>
//                 <span className="pending-count">Pending: {pendingAppointments}</span>
//                 <span className="approved-count">With Doctor: {approvedAppointments}</span>
//                 <span className="confirmed-count">Confirmed: {confirmedAppointments}</span>
//                 <span className="completed-count">Completed: {completedAppointments}</span>
//               </div>
//             </div>

//             {loading.appointments ? (
//               <div className="loading">Loading appointments...</div>
//             ) : appointments.length === 0 ? (
//               <div className="empty-state">
//                 <p>No appointments found</p>
//                 <small>When patients book appointments, they will appear here</small>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Patient</th>
//                     <th>Doctor</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Booked On</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((app) => {
//                     const badge = getStatusBadge(app.status);
//                     return (
//                       <tr key={app._id}>
//                         <td>
//                           <div className="patient-info">
//                             <strong>{app.patientId?.firstname || 'N/A'} {app.patientId?.lastname || ''}</strong>
//                             <br />
//                             <small>{app.patientId?.email || 'No email'}</small>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="doctor-info">
//                             <strong>Dr. {app.doctorId?.userId?.firstname || 'N/A'} {app.doctorId?.userId?.lastname || ''}</strong>
//                             <br />
//                             <small>{app.doctorId?.specialization || 'N/A'}</small>
//                           </div>
//                         </td>
//                         <td>{app.date || 'N/A'}</td>
//                         <td>{app.time || 'N/A'}</td>
//                         <td>
//                           <span className={`status-badge ${badge.class}`}>
//                             {badge.text}
//                           </span>
//                         </td>
//                         <td>{formatDate(app.createdAt)}</td>
//                         <td>
//                           {app.status === "pending" && (
//                             <button 
//                               className="btn-approve"
//                               onClick={() => handleApproveAppointment(app._id)}
//                             >
//                               ✓ Approve & Send to Doctor
//                             </button>
//                           )}
//                           {app.status === "approved" && (
//                             <span className="status-message">
//                               ⏳ Waiting for doctor confirmation
//                             </span>
//                           )}
//                           {app.status === "confirmed" && (
//                             <span className="status-message confirmed">
//                               ✅ Confirmed by Doctor
//                             </span>
//                           )}
//                           {app.status === "completed" && (
//                             <span className="status-message completed">
//                               ✓ Completed
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ DOCTOR APPLICATIONS TAB ============ */}
//         {activeTab === 'applications' && (
//           <div className="table-container">
//             <h2>Pending Doctor Applications</h2>
//             {loading.pendingDoctors ? (
//               <div className="loading">Loading applications...</div>
//             ) : pendingDoctors.length === 0 ? (
//               <div className="empty-state">
//                 <p>No pending applications</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Specialization</th>
//                     <th>Experience</th>
//                     <th>Fees</th>
//                     <th>Applied On</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingDoctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td>Dr. {doc.userId?.firstname} {doc.userId?.lastname}</td>
//                       <td>{doc.userId?.email}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.experience} years</td>
//                       <td>${doc.fees}</td>
//                       <td>{formatDate(doc.createdAt)}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             className="btn-approve"
//                             onClick={() => handleApproveDoctor(doc.userId?._id)}
//                           >
//                             Approve
//                           </button>
//                           <button 
//                             className="btn-reject"
//                             onClick={() => handleRejectDoctor(doc.userId?._id)}
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ DOCTORS TAB ============ */}
//         {activeTab === 'doctors' && (
//           <div className="table-container">
//             <h2>Approved Doctors</h2>
//             {loading.doctors ? (
//               <div className="loading">Loading doctors...</div>
//             ) : doctors.length === 0 ? (
//               <div className="empty-state">
//                 <p>No approved doctors found</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Doctor Name</th>
//                     <th>Specialization</th>
//                     <th>Experience</th>
//                     <th>Fees</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors.map((doc) => (
//                     <tr key={doc._id}>
//                       <td>Dr. {doc.name}</td>
//                       <td>{doc.specialization}</td>
//                       <td>{doc.experience} years</td>
//                       <td>${doc.fees}</td>
//                       <td><span className="status-active">Active</span></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ============ USERS TAB ============ */}
//         {activeTab === 'users' && (
//           <div className="table-container">
//             <h2>All Users</h2>
//             {loading.users ? (
//               <div className="loading">Loading users...</div>
//             ) : users.length === 0 ? (
//               <div className="empty-state">
//                 <p>No users found</p>
//               </div>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Mobile</th>
//                     <th>Joined</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user._id}>
//                       <td>{user.firstname} {user.lastname}</td>
//                       <td>{user.email}</td>
//                       <td>
//                         <span className={`role-badge role-${user.role}`}>{user.role}</span>
//                       </td>
//                       <td>{user.mobile || 'N/A'}</td>
//                       <td>{formatDate(user.createdAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;