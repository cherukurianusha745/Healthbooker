// // // import React from "react";
// // // import AdminApplications from "../components/AdminApplications";
// // // import AdminAppointments from "../components/AdminAppointments";
// // // import AdminDoctors from "../components/AdminDoctors";
// // // import Sidebar from "../components/Sidebar";
// // // import Users from "../components/Users";

// // // const Dashboard = (props) => {
// // //   const { type } = props;
// // //   return (
// // //     <>
// // //       <section className="layout-section">
// // //         <div className="layout-container">
// // //           <Sidebar />
// // //           {type === "users" ? (
// // //             <Users />
// // //           ) : type === "doctors" ? (
// // //             <AdminDoctors />
// // //           ) : type === "applications" ? (
// // //             <AdminApplications />
// // //           ) : type === "appointments" ? (
// // //             <AdminAppointments />
// // //           ) : (
// // //             <></>
// // //           )}
// // //         </div>
// // //       </section>
// // //     </>
// // //   );
// // // };

// // // export default Dashboard;
// // import React from "react";
// // import AdminApplications from "../components/AdminApplications";
// // import AdminAppointments from "../components/AdminAppointments";
// // import AdminDoctors from "../components/AdminDoctors";
// // import Sidebar from "../components/Sidebar";
// // import Users from "../components/Users";


// // const Dashboard = (props) => {
// //   const { type } = props;
  
// //   return (
// //     <section className="layout-section">
// //       <div className="layout-container">
// //         <Sidebar />
// //         <div className="dashboard-content">
// //           {type === "users" ? (
// //             <Users />
// //           ) : type === "doctors" ? (
// //             <AdminDoctors />
// //           ) : type === "applications" ? (
// //             <AdminApplications />
// //           ) : type === "appointments" ? (
// //             <AdminAppointments />
// //           ) : (
// //             <div className="welcome-dashboard">
// //               <h2>Welcome to Admin Dashboard</h2>
// //               <p>Select an option from the sidebar to manage the system</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Sidebar from "../components/Sidebar";
// import Users from "../components/Users";
// import AdminDoctors from "../components/AdminDoctors";
// import AdminApplications from "../components/AdminApplications";
// import AdminAppointments from "../components/AdminAppointments";
// import "../styles/dashboard.css";

// axios.defaults.baseURL = "http://localhost:5002/api";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { section } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       setUser(userData);
      
//       // Verify user is admin
//       if (userData.role !== "admin" && !userData.isAdmin) {
//         toast.error("Access denied. Admin only.");
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Determine which section to show based on URL
//   const getActiveSection = () => {
//     if (!section) return "dashboard";
//     return section.toLowerCase();
//   };

//   const activeSection = getActiveSection();

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>;
//   }

//   return (
//     <section className="layout-section">
//       <div className="layout-container">
//         <Sidebar />
//         <div className="dashboard-content">
//           {activeSection === "users" && <Users />}
//           {activeSection === "admin-doctors" && <AdminDoctors />}
//           {activeSection === "applications" && <AdminApplications />}
//           {activeSection === "appointments" && <AdminAppointments />}
//           {activeSection === "dashboard" && (
//             <div className="welcome-dashboard">
//               <h2>Welcome to Admin Dashboard</h2>
//               <p>Select an option from the sidebar to manage the system</p>
              
//               {/* Quick Stats */}
//               <div className="quick-stats">
//                 <div className="stat-card">
//                   <h3>Total Appointments</h3>
//                   <p className="stat-number">--</p>
//                 </div>
//                 <div className="stat-card">
//                   <h3>Pending Approvals</h3>
//                   <p className="stat-number">--</p>
//                 </div>
//                 <div className="stat-card">
//                   <h3>Total Doctors</h3>
//                   <p className="stat-number">--</p>
//                 </div>
//                 <div className="stat-card">
//                   <h3>Total Users</h3>
//                   <p className="stat-number">--</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;
import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import "../styles/dashboard.css";

const Dashboard = (props) => {
  const { type } = props;
  
  return (
    <section className="layout-section">
      <div className="layout-container">
        <Sidebar />
        <div className="dashboard-content">
          {type === "users" ? (
            <Users />
          ) : type === "doctors" ? (
            <AdminDoctors />
          ) : type === "applications" ? (
            <AdminApplications />
          ) : type === "appointments" ? (
            <AdminAppointments />
          ) : (
            <div className="welcome-dashboard">
              <h2>Welcome to Admin Dashboard</h2>
              <p>Select an option from the sidebar to manage the system</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;