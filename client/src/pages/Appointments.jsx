// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// axios.defaults.baseURL = "http://localhost:5002/api";

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         toast.error("Please login first");
//         return;
//       }

//       // Try multiple endpoints
//       let response;
//       const endpoints = [
//         "/appointment/my-appointments",
//         "/appointment/getallappointments", 
//         "/appointment/user-appointments"
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`Trying ${endpoint}...`);
//           response = await axios.get(endpoint, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (response.status === 200) {
//             console.log(`✅ Success with ${endpoint}`);
//             break;
//           }
//         } catch (err) {
//           console.log(`${endpoint} failed`);
//         }
//       }

//       if (response && response.data) {
//         // Handle different response formats
//         let appointmentsData = [];
//         if (Array.isArray(response.data)) {
//           appointmentsData = response.data;
//         } else if (response.data.appointments) {
//           appointmentsData = response.data.appointments;
//         } else if (response.data.data) {
//           appointmentsData = response.data.data;
//         }
        
//         setAppointments(appointmentsData);
//         console.log("Appointments loaded:", appointmentsData);
//       } else {
//         toast.error("No appointments found");
//       }
      
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading appointments...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="appointments-page">
//       <h1>My Appointments</h1>
      
//       {appointments.length === 0 ? (
//         <div className="no-appointments">
//           <p>No appointments found</p>
//           <button 
//             className="btn-primary"
//             onClick={() => window.location.href = "/doctors"}
//           >
//             Book an Appointment
//           </button>
//         </div>
//       ) : (
//         <div className="appointments-list">
//           {appointments.map((app) => (
//             <div key={app._id} className="appointment-card">
//               <h3>{app.doctorName || "Dr. " + (app.doctorId?.userId?.firstname || "Doctor")}</h3>
//               <p>Date: {app.date}</p>
//               <p>Time: {app.time}</p>
//               <p>Status: {app.status}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Appointments;
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Empty from "../components/Empty";
import Loading from "../components/Loading";
import "../styles/appointments.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token");
      }
    }
    getAllAppointments();
  }, []);

  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwt_decode(token);
      let endpoint = "";

      if (decoded.role === "admin") {
        endpoint = "/appointment/admin-appointments";
      } else if (decoded.role === "doctor") {
        endpoint = "/appointment/doctor-appointments";
      } else {
        endpoint = "/appointment/user-appointments";
      }

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments(data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load appointments");
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `/appointment/approve/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Appointment approved successfully");
      getAllAppointments();
    } catch (error) {
      toast.error("Failed to approve appointment");
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `/appointment/confirm/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Appointment confirmed successfully");
      getAllAppointments();
    } catch (error) {
      toast.error("Failed to confirm appointment");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        "/appointment/completed",
        { appointid: appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Appointment completed successfully");
      getAllAppointments();
    } catch (error) {
      toast.error("Failed to complete appointment");
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <section className="appointments-section">
        <h2 className="page-heading">
          {user?.role === "admin"
            ? "All Appointments"
            : user?.role === "doctor"
            ? "My Appointments"
            : "My Appointments"}
        </h2>

        {appointments.length > 0 ? (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {(user?.role === "admin" || user?.role === "doctor") && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{index + 1}</td>
                    <td>
                      {appointment.patientId?.firstname} {appointment.patientId?.lastname}
                    </td>
                    <td>
                      Dr. {appointment.doctorId?.userId?.firstname} {appointment.doctorId?.userId?.lastname}
                    </td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {user?.role === "admin" && appointment.status === "pending" && (
                        <button
                          className="btn approve-btn"
                          onClick={() => approveAppointment(appointment._id)}
                        >
                          Approve
                        </button>
                      )}
                      {user?.role === "doctor" && appointment.status === "approved" && (
                        <button
                          className="btn confirm-btn"
                          onClick={() => confirmAppointment(appointment._id)}
                        >
                          Confirm
                        </button>
                      )}
                      {user?.role === "doctor" && appointment.status === "confirmed" && (
                        <button
                          className="btn complete-btn"
                          onClick={() => completeAppointment(appointment._id)}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty message="No appointments found" />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Appointments;