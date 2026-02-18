// import React, { useEffect, useState } from "react";
// import "../styles/profile.css";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { setLoading } from "../redux/reducers/rootSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Loading from "../components/Loading";
// import fetchData from "../helper/apiCall";
// import jwt_decode from "jwt-decode";

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// function Profile() {
//   const { userId } = jwt_decode(localStorage.getItem("token"));
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.root);
//   const [file, setFile] = useState("");
//   const [formDetails, setFormDetails] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     age: "",
//     mobile: "",
//     gender: "neither",
//     address: "",
//     password: "",
//     confpassword: "",
//   });

//   const getUser = async () => {
//     try {
//       dispatch(setLoading(true));
//       const temp = await fetchData(`/user/getuser/${userId}`);
//       setFormDetails({
//         ...temp,
//         password: "",
//         confpassword: "",
//         mobile: temp.mobile === null ? "" : temp.mobile,
//         age: temp.age === null ? "" : temp.age,
//       });
//       setFile(temp.pic);
//       dispatch(setLoading(false));
//     } catch (error) {}
//   };

//   useEffect(() => {
//     getUser();
//   }, [dispatch]);

//   const inputChange = (e) => {
//     const { name, value } = e.target;
//     return setFormDetails({
//       ...formDetails,
//       [name]: value,
//     });
//   };

//   const formSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       const {
//         firstname,
//         lastname,
//         email,
//         age,
//         mobile,
//         address,
//         gender,
//         password,
//         confpassword,
//       } = formDetails;

//       if (!email) {
//         return toast.error("Email should not be empty");
//       } else if (firstname.length < 3) {
//         return toast.error("First name must be at least 3 characters long");
//       } else if (lastname.length < 3) {
//         return toast.error("Last name must be at least 3 characters long");
//       } else if (password.length < 5) {
//         return toast.error("Password must be at least 5 characters long");
//       } else if (password !== confpassword) {
//         return toast.error("Passwords do not match");
//       }
//       await toast.promise(
//         axios.put(
//           "/user/updateprofile",
//           {
//             firstname,
//             lastname,
//             age,
//             mobile,
//             address,
//             gender,
//             email,
//             password,
//           },
//           {
//             headers: {
//               authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         ),
//         {
//           pending: "Updating profile...",
//           success: "Profile updated successfully",
//           error: "Unable to update profile",
//           loading: "Updating profile...",
//         }
//       );

//       setFormDetails({ ...formDetails, password: "", confpassword: "" });
//     } catch (error) {
//       return toast.error("Unable to update profile");
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <section className="register-section flex-center">
//           <div className="profile-container flex-center">
//             <h2 className="form-heading">Profile</h2>
//             <img
//               src={file}
//               alt="profile"
//               className="profile-pic"
//             />
//             <form
//               onSubmit={formSubmit}
//               className="register-form"
//             >
//               <div className="form-same-row">
//                 <input
//                   type="text"
//                   name="firstname"
//                   className="form-input"
//                   placeholder="Enter your first name"
//                   value={formDetails.firstname}
//                   onChange={inputChange}
//                 />
//                 <input
//                   type="text"
//                   name="lastname"
//                   className="form-input"
//                   placeholder="Enter your last name"
//                   value={formDetails.lastname}
//                   onChange={inputChange}
//                 />
//               </div>
//               <div className="form-same-row">
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-input"
//                   placeholder="Enter your email"
//                   value={formDetails.email}
//                   onChange={inputChange}
//                 />
//                 <select
//                   name="gender"
//                   value={formDetails.gender}
//                   className="form-input"
//                   id="gender"
//                   onChange={inputChange}
//                 >
//                   <option value="neither">Prefer not to say</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>
//               <div className="form-same-row">
//                 <input
//                   type="text"
//                   name="age"
//                   className="form-input"
//                   placeholder="Enter your age"
//                   value={formDetails.age}
//                   onChange={inputChange}
//                 />
//                 <input
//                   type="text"
//                   name="mobile"
//                   className="form-input"
//                   placeholder="Enter your mobile number"
//                   value={formDetails?.mobile}
//                   onChange={inputChange}
//                 />
//               </div>
//               <textarea
//                 type="text"
//                 name="address"
//                 className="form-input"
//                 placeholder="Enter your address"
//                 value={formDetails.address}
//                 onChange={inputChange}
//                 rows="2"
//               ></textarea>
//               <div className="form-same-row">
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-input"
//                   placeholder="Enter your password"
//                   value={formDetails.password}
//                   onChange={inputChange}
//                 />
//                 <input
//                   type="password"
//                   name="confpassword"
//                   className="form-input"
//                   placeholder="Confirm your password"
//                   value={formDetails.confpassword}
//                   onChange={inputChange}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="btn form-btn"
//               >
//                 update
//               </button>
//             </form>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }

// export default Profile;
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "../styles/profile.css";

axios.defaults.baseURL = "http://localhost:5002/api";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwt_decode(token);
      
      const { data } = await axios.get(`/users/getuser/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormDetails({
        ...data,
        password: "",
        confpassword: "",
      });
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    
    const { password, confpassword } = formDetails;

    if (password && password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }

    if (password !== confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        "/users/updateprofile",
        formDetails,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Profile updated successfully");
      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <section className="profile-section">
        <div className="profile-container">
          <h2 className="form-heading">My Profile</h2>
          
          <div className="profile-avatar">
            <img
              src={formDetails.pic}
              alt="profile"
              className="profile-pic"
            />
          </div>

          <form onSubmit={formSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-input"
                  placeholder="Enter your first name"
                  value={formDetails.firstname}
                  onChange={inputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-input"
                  placeholder="Enter your last name"
                  value={formDetails.lastname}
                  onChange={inputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails.mobile}
                  onChange={inputChange}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div>
            </div>

            <button type="submit" className="btn update-btn">
              Update Profile
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Profile;