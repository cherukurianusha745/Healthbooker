// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import "../styles/register.css";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { setUserInfo } from "../redux/reducers/rootSlice";
// import jwt_decode from "jwt-decode";
// import fetchData from "../helper/apiCall";

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Separate states
//   const [admin, setAdmin] = useState({ email: "", password: "" });
//   const [doctor, setDoctor] = useState({ email: "", password: "" });
//   const [user, setUser] = useState({ email: "", password: "" });

//   // ✅ Common login function
//   const login = async (email, password, role) => {
//     try {
//       if (!email || !password) {
//         return toast.error("Input field should not be empty");
//       }

//       if (password.length < 5) {
//         return toast.error("Password must be at least 5 characters long");
//       }

//       const { data } = await toast.promise(
//         axios.post("/user/login", { email, password, role }),
//         {
//           loading: "Logging in...",
//           success: "Login successful",
//           error: "Invalid credentials",
//         }
//       );

//       localStorage.setItem("token", data.token);

//       const decoded = jwt_decode(data.token);
//       dispatch(setUserInfo(decoded.userId));

//       const temp = await fetchData(`/user/getuser/${decoded.userId}`);
//       dispatch(setUserInfo(temp));

//       if (role === "admin") navigate("/admin");
//       else if (role === "doctor") navigate("/doctor");
//       else navigate("/");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <section className="register-section flex-center">
//       <div className="multi-login-container">

//         {/* ================= ADMIN ================= */}
//         <div className="login-box purple">
//           <h3>Admin Login</h3>

//           <input
//             type="email"
//             placeholder="Enter email"
//             className="form-input"
//             onChange={(e) =>
//               setAdmin({ ...admin, email: e.target.value })
//             }
//           />

//           <input
//             type="password"
//             placeholder="Enter password"
//             className="form-input"
//             onChange={(e) =>
//               setAdmin({ ...admin, password: e.target.value })
//             }
//           />

//           <button
//             className="btn form-btn"
//             onClick={() =>
//               login(admin.email, admin.password, "admin")
//             }
//           >
//             Login
//           </button>
//         </div>

//         {/* ================= DOCTOR ================= */}
//         <div className="login-box orange">
//           <h3>Doctor Login</h3>

//           <input
//             type="email"
//             placeholder="Enter email"
//             className="form-input"
//             onChange={(e) =>
//               setDoctor({ ...doctor, email: e.target.value })
//             }
//           />

//           <input
//             type="password"
//             placeholder="Enter password"
//             className="form-input"
//             onChange={(e) =>
//               setDoctor({ ...doctor, password: e.target.value })
//             }
//           />

//           <button
//             className="btn form-btn"
//             onClick={() =>
//               login(doctor.email, doctor.password, "doctor")
//             }
//           >
//             Login
//           </button>
//         </div>

//         {/* ================= USER ================= */}
//         <div className="login-box blue">
//           <h3>User Login</h3>

//           <input
//             type="email"
//             placeholder="Enter email"
//             className="form-input"
//             onChange={(e) =>
//               setUser({ ...user, email: e.target.value })
//             }
//           />

//           <input
//             type="password"
//             placeholder="Enter password"
//             className="form-input"
//             onChange={(e) =>
//               setUser({ ...user, password: e.target.value })
//             }
//           />

//           <button
//             className="btn form-btn"
//             onClick={() =>
//               login(user.email, user.password, "user")
//             }
//           >
//             Login
//           </button>

//           <p>
//             New User?{" "}
//             <NavLink className="login-link" to="/register">
//               Register
//             </NavLink>
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// }

// export default Login;
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:5002/api"; // Use direct URL for now

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Separate states for each role
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [doctor, setDoctor] = useState({ email: "", password: "" });
  const [user, setUser] = useState({ email: "", password: "" });

  // Common login function
  const login = async (email, password) => {
    try {
      // Validation
      if (!email || !password) {
        return toast.error("Email and password are required");
      }

      if (password.length < 5) {
        return toast.error("Password must be at least 5 characters");
      }

      setLoading(true);

      // ✅ CORRECT ENDPOINT: /users/login (plural)
      const { data } = await axios.post("/users/login", { 
        email, 
        password 
      });

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.firstname}!`);

      // Navigate based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error responses
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.message || "Invalid credentials");
      } else if (error.request) {
        // No response from server
        toast.error("Cannot connect to server. Make sure backend is running.");
      } else {
        // Other errors
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="multi-login-container">

        {/* ================= ADMIN ================= */}
        <div className="login-box purple">
          <h3>Admin Login</h3>
          <input
            type="email"
            placeholder="Enter email"
            className="form-input"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter password"
            className="form-input"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          />
          <button
            className="btn form-btn"
            onClick={() => login(admin.email, admin.password)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="demo-credentials">
            <small>Demo: admin@healthbooker.com / admin123</small>
          </div>
        </div>

        {/* ================= DOCTOR ================= */}
        <div className="login-box orange">
          <h3>Doctor Login</h3>
          <input
            type="email"
            placeholder="Enter email"
            className="form-input"
            value={doctor.email}
            onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter password"
            className="form-input"
            value={doctor.password}
            onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
          />
          <button
            className="btn form-btn"
            onClick={() => login(doctor.email, doctor.password)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="demo-credentials">
            <small>Demo: doctor@healthbooker.com / doctor123</small>
          </div>
        </div>

        {/* ================= PATIENT ================= */}
        <div className="login-box blue">
          <h3>Patient Login</h3>
          <input
            type="email"
            placeholder="Enter email"
            className="form-input"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter password"
            className="form-input"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button
            className="btn form-btn"
            onClick={() => login(user.email, user.password)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>
            New User?{" "}
            <NavLink className="login-link" to="/register">
              Register
            </NavLink>
          </p>
        </div>

      </div>
    </section>
  );
}

export default Login;