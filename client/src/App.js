// import "./styles/app.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import { Toaster } from "react-hot-toast";
// import { Protected, Public, Admin } from "./middleware/route";
// import React, { lazy, Suspense } from "react";
// import Loading from "./components/Loading";

// const Home = lazy(() => import("./pages/Home"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Appointments = lazy(() => import("./pages/Appointments"));
// const Doctors = lazy(() => import("./pages/Doctors"));
// const Profile = lazy(() => import("./pages/Profile"));
// const Notifications = lazy(() => import("./pages/Notifications"));
// const ApplyDoctor = lazy(() => import("./pages/ApplyDoctor"));
// const Error = lazy(() => import("./pages/Error"));
// const token = localStorage.getItem("token");
// function App() {
//   return (
//     <Router>
//       <Toaster />
//       <Suspense fallback={<Loading />}>
//         <Routes>
//           <Route
//             path="/login"
//             element={<Login />}
//           />
//           <Route
//             path="/register"
//             element={
//               <Public>
//                 <Register />
//               </Public>
//             }
//           />
//           <Route
//             path="/"
//             element={<Home />}
//           />
//           <Route
//             path="/doctors"
//             element={<Doctors />}
//           />
//           <Route
//             path="/appointments"
//             element={
//               <Protected>
//                 <Appointments />
//               </Protected>
//             }
//           />
//           <Route
//             path="/notifications"
//             element={
//               <Protected>
//                 <Notifications />
//               </Protected>
//             }
//           />
//           <Route
//             path="/applyfordoctor"
//             element={
//               <Protected>
//                 <ApplyDoctor />
//               </Protected>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <Protected>
//                 <Profile />
//               </Protected>
//             }
//           />
//           <Route
//             path="/dashboard/users"
//             element={
//               <Admin>
//                 <Dashboard type={"users"} />
//               </Admin>
//             }
//           />
//           <Route
//             path="/dashboard/doctors"
//             element={
//               <Admin>
//                 <Dashboard type={"doctors"} />
//               </Admin>
//             }
//           />
//           <Route
//             path="/dashboard/appointments"
//             element={
//               <Protected>
//                 <Dashboard type={"appointments"} />
//               </Protected>
//             }
//           />
//           <Route
//             path="/dashboard/applications"
//             element={
//               <Protected>
//                 <Dashboard type={"applications"} />
//               </Protected>
//             }
//           />
//           <Route
//             path="*"
//             element={<Error />}
//           />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ApplyDoctor from "./pages/ApplyDoctor";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AdminAppointments from "./components/AdminAppointments";
import TestDoctor from "./pages/TestDoctor";
import DoctorDashboard from "./components/DoctorDashboard";
import TestLogin from "./pages/TestLogin";
import DoctorLoginCards from "./pages/DoctorLoginCards";
import PatientDashboard from "./components/PatientDashboard";
import MyAppointments from "./components/MyAppointments";
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        {/* Protected Routes - All Users */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/doctors" element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Patient Only Routes */}
        <Route path="/apply-doctor" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <ApplyDoctor />
          </ProtectedRoute>
        } />
        
        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/:section" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Direct route to appointments for testing */}
        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAppointments />
          </ProtectedRoute>
        } />
        <Route path="/doctor" element={
  <ProtectedRoute allowedRoles={['doctor']}>
    <DoctorDashboard />
  </ProtectedRoute>
} /><Route path="/test-login" element={<TestLogin />} />

<Route path="/select-doctor" element={<DoctorLoginCards />} />
        <Route path="/test-doctor" element={<TestDoctor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;