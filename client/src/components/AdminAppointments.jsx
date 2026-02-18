// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Loading from "./Loading";
// import { setLoading } from "../redux/reducers/rootSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Empty from "./Empty";
// import fetchData from "../helper/apiCall";
// import "../styles/user.css";

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.root);

//   const getAllAppoint = async (e) => {
//     try {
//       dispatch(setLoading(true));
//       const temp = await fetchData(`/appointment/getallappointments`);
//       setAppointments(temp);
//       dispatch(setLoading(false));
//     } catch (error) {}
//   };

//   useEffect(() => {
//     getAllAppoint();
//   }, []);

//   const complete = async (ele) => {
//     try {
//       await toast.promise(
//         axios.put(
//           "/appointment/completed",
//           {
//             appointid: ele?._id,
//             doctorId: ele?.doctorId._id,
//             doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         ),
//         {
//           success: "Appointment booked successfully",
//           error: "Unable to book appointment",
//           loading: "Booking appointment...",
//         }
//       );

//       getAllAppoint();
//     } catch (error) {
//       return error;
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <section className="user-section">
//           <h3 className="home-sub-heading">All Users</h3>
//           {appointments.length > 0 ? (
//             <div className="user-container">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Doctor</th>
//                     <th>Patient</th>
//                     <th>Appointment Date</th>
//                     <th>Appointment Time</th>
//                     <th>Booking Date</th>
//                     <th>Booking Time</th>
//                     <th>Status</th>

//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments?.map((ele, i) => {
//                     return (
//                       <tr key={ele?._id}>
//                         <td>{i + 1}</td>
//                         <td>
//                           {ele?.doctorId?.firstname +
//                             " " +
//                             ele?.doctorId?.lastname}
//                         </td>
//                         <td>
//                           {ele?.userId?.firstname + " " + ele?.userId?.lastname}
//                         </td>
//                         <td>{ele?.date}</td>
//                         <td>{ele?.time}</td>
//                         <td>{ele?.createdAt.split("T")[0]}</td>
//                         <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
//                         <td>{ele?.status}</td>
//                         <td>
//                           <button
//                             className={`btn user-btn accept-btn ${
//                               ele?.status === "Completed" ? "disable-btn" : ""
//                             }`}
//                             disabled={ele?.status === "Completed"}
//                             onClick={() => complete(ele)}
//                           >
//                             Complete
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <Empty />
//           )}
//         </section>
//       )}
//     </>
//   );
// };

// export default AdminAppointments;
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/admin.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/appointment/admin-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Appointments received:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="badge pending">Pending</span>;
      case 'approved': return <span className="badge approved">Approved</span>;
      case 'confirmed': return <span className="badge confirmed">Confirmed</span>;
      case 'completed': return <span className="badge completed">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="admin-appointments">
      <div className="section-header">
        <h2>Appointment Management</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({appointments.filter(a => a.status === 'approved').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found</p>
        </div>
      ) : (
        <table className="appointments-table">
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
            {filteredAppointments.map((app) => (
              <tr key={app._id}>
                <td>
                  <strong>{app.patientId?.firstname} {app.patientId?.lastname}</strong>
                  <br />
                  <small>{app.patientId?.email}</small>
                </td>
                <td>
                  Dr. {app.doctorId?.userId?.firstname} {app.doctorId?.userId?.lastname}
                  <br />
                  <small>{app.doctorId?.specialization}</small>
                </td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{getStatusBadge(app.status)}</td>
                <td>
                  {app.status === 'pending' && (
                    <button 
                      className="btn-approve"
                      onClick={() => handleApprove(app._id)}
                    >
                      Approve
                    </button>
                  )}
                  {app.status === 'approved' && (
                    <span className="status-text">Waiting for doctor</span>
                  )}
                  {app.status === 'confirmed' && (
                    <span className="status-text confirmed">Confirmed by doctor</span>
                  )}
                  {app.status === 'completed' && (
                    <span className="status-text completed">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAppointments;