// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import "../styles/register.css";
// import axios from "axios";
// import toast from "react-hot-toast";

// // Backend base URL
// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// function Register() {
//   // ---------------- STATE ----------------
//   const [file, setFile] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [formDetails, setFormDetails] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//     confpassword: "",
//   });

//   const navigate = useNavigate();

//   // ---------------- INPUT HANDLER ----------------
//   const inputChange = (e) => {
//     const { name, value } = e.target;
//     setFormDetails({
//       ...formDetails,
//       [name]: value,
//     });
//   };

//   // ---------------- CLOUDINARY IMAGE UPLOAD ----------------
//   const onUpload = async (element) => {
//     if (!element) return;

//     if (
//       element.type !== "image/jpeg" &&
//       element.type !== "image/png"
//     ) {
//       toast.error("Please select a JPEG or PNG image");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = new FormData();
//       data.append("file", element);
//       data.append(
//         "upload_preset",
//         process.env.REACT_APP_CLOUDINARY_PRESET
//       );

//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: data,
//         }
//       );

//       const result = await res.json();

//       if (!result.secure_url) {
//         throw new Error("Cloudinary upload failed");
//       }

//       setFile(result.secure_url);
//       toast.success("Image uploaded successfully");
//     } catch (error) {
//       console.error(error);
//       toast.error("Image upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- FORM SUBMIT ----------------
//   const formSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     const { firstname, lastname, email, password, confpassword } =
//       formDetails;

//     if (!firstname || !lastname || !email || !password || !confpassword) {
//       return toast.error("All fields are required");
//     }
//     if (firstname.length < 3) {
//       return toast.error("First name must be at least 3 characters");
//     }
//     if (lastname.length < 3) {
//       return toast.error("Last name must be at least 3 characters");
//     }
//     if (password.length < 5) {
//       return toast.error("Password must be at least 5 characters");
//     }
//     if (password !== confpassword) {
//       return toast.error("Passwords do not match");
//     }
//     if (!file) {
//       return toast.error("Please upload a profile image");
//     }

//     try {
//       await toast.promise(
//         axios.post("/user/register", {
//           firstname,
//           lastname,
//           email,
//           password,
//           pic: file,
//         }),
//         {
//           loading: "Registering user...",
//           success: "User registered successfully",
//           error: "Unable to register user",
//         }
//       );

//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ---------------- JSX ----------------
//   return (
//     <section className="register-section flex-center">
//       <div className="register-container flex-center">
//         <h2 className="form-heading">Sign Up</h2>

//         <form onSubmit={formSubmit} className="register-form">
//           <input
//             type="text"
//             name="firstname"
//             className="form-input"
//             placeholder="Enter your first name"
//             value={formDetails.firstname}
//             onChange={inputChange}
//           />

//           <input
//             type="text"
//             name="lastname"
//             className="form-input"
//             placeholder="Enter your last name"
//             value={formDetails.lastname}
//             onChange={inputChange}
//           />

//           <input
//             type="email"
//             name="email"
//             className="form-input"
//             placeholder="Enter your email"
//             value={formDetails.email}
//             onChange={inputChange}
//           />

//           <input
//             type="file"
//             className="form-input"
//             accept="image/*"
//             onChange={(e) => onUpload(e.target.files[0])}
//           />

//           <input
//             type="password"
//             name="password"
//             className="form-input"
//             placeholder="Enter your password"
//             value={formDetails.password}
//             onChange={inputChange}
//           />

//           <input
//             type="password"
//             name="confpassword"
//             className="form-input"
//             placeholder="Confirm your password"
//             value={formDetails.confpassword}
//             onChange={inputChange}
//           />

//           <button
//             type="submit"
//             className="btn form-btn"
//             disabled={loading}
//           >
//             {loading ? "Please wait..." : "Sign Up"}
//           </button>
//         </form>

//         <p>
//           Already a user?{" "}
//           <NavLink className="login-link" to="/login">
//             Log in
//           </NavLink>
//         </p>
//       </div>
//     </section>
//   );
// }

// export default Register; 
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/auth.css";

axios.defaults.baseURL = "http://localhost:5002/api";

function Register() {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, email, password, confpassword } = formDetails;

    if (!firstname || !lastname || !email || !password || !confpassword) {
      return toast.error("All fields are required");
    }

    if (firstname.length < 3) {
      return toast.error("First name must be at least 3 characters");
    }

    if (lastname.length < 3) {
      return toast.error("Last name must be at least 3 characters");
    }

    if (password.length < 5) {
      return toast.error("Password must be at least 5 characters");
    }

    if (password !== confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      
      await axios.post("/users/register", {
        firstname,
        lastname,
        email,
        password,
        role: "patient"
      });

      toast.success("Registration successful! Please login.");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h2 className="auth-heading">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                className="form-input"
                placeholder="First name"
                value={formDetails.firstname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                className="form-input"
                placeholder="Last name"
                value={formDetails.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formDetails.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confpassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formDetails.confpassword}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn auth-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="auth-link">
            Already have an account?{" "}
            <NavLink to="/login">Login here</NavLink>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;