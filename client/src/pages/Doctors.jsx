// // // import React, { useEffect, useState } from "react";
// // // import DoctorCard from "../components/DoctorCard";
// // // import Footer from "../components/Footer";
// // // import Navbar from "../components/Navbar";
// // // import "../styles/doctors.css";
// // // import fetchData from "../helper/apiCall";
// // // import Loading from "../components/Loading";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { setLoading } from "../redux/reducers/rootSlice";
// // // import Empty from "../components/Empty";

// // // const Doctors = () => {
// // //   const [doctors, setDoctors] = useState([]);
// // //   const dispatch = useDispatch();
// // //   const { loading } = useSelector((state) => state.root);

// // //   const fetchAllDocs = async () => {
// // //     dispatch(setLoading(true));
// // //     const data = await fetchData(`/doctor/getalldoctors`);
// // //     setDoctors(data);
// // //     dispatch(setLoading(false));
// // //   };

// // //   useEffect(() => {
// // //     fetchAllDocs();
// // //   }, []);

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       {loading && <Loading />}
// // //       {!loading && (
// // //         <section className="container doctors">
// // //           <h2 className="page-heading">Our Doctors</h2>
// // //           {doctors.length > 0 ? (
// // //             <div className="doctors-card-container">
// // //               {doctors.map((ele) => {
// // //                 return (
// // //                   <DoctorCard
// // //                     ele={ele}
// // //                     key={ele._id}
// // //                   />
// // //                 );
// // //               })}
// // //             </div>
// // //           ) : (
// // //             <Empty />
// // //           )}
// // //         </section>
// // //       )}
// // //       <Footer />
// // //     </>
// // //   );
// // // };

// // // export default Doctors;
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import Navbar from "../components/Navbar";
// // import Footer from "../components/Footer";
// // import Loading from "../components/Loading";
// // import "../styles/doctors.css";

// // axios.defaults.baseURL = "http://localhost:5002/api";

// // function Doctors() {
// //   const [doctors, setDoctors] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [bookingDetails, setBookingDetails] = useState({
// //     doctorId: "",
// //     date: "",
// //     time: ""
// //   });
// //   const [showBooking, setShowBooking] = useState(false);

// //   useEffect(() => {
// //     getDoctors();
// //   }, []);

// //   const getDoctors = async () => {
// //     try {
// //       setLoading(true);
// //       const { data } = await axios.get("/doctors/get-doctors");
// //       setDoctors(data);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Failed to load doctors");
// //       setLoading(false);
// //     }
// //   };

// //   const handleBooking = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const token = localStorage.getItem("token");
      
// //       await axios.post(
// //         "/appointment/book",
// //         {
// //           doctorId: bookingDetails.doctorId,
// //           date: bookingDetails.date,
// //           time: bookingDetails.time
// //         },
// //         {
// //           headers: { Authorization: `Bearer ${token}` }
// //         }
// //       );

// //       toast.success("Appointment booked successfully");
// //       setShowBooking(false);
// //       setBookingDetails({ doctorId: "", date: "", time: "" });
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Failed to book appointment");
// //     }
// //   };

// //   if (loading) return <Loading />;

// //   return (
// //     <>
// //       <Navbar />
// //       <section className="doctors-section">
// //         <h2 className="page-heading">Available Doctors</h2>

// //         {doctors.length === 0 ? (
// //           <p className="no-doctors">No Doctors Available</p>
// //         ) : (
// //           <div className="doctors-grid">
// //             {doctors.map((doctor) => (
// //               <div className="doctor-card" key={doctor._id}>
// //                 <div className="doctor-info">
// //                   <h3>{doctor.name}</h3>
// //                   <p><strong>Specialization:</strong> {doctor.specialization}</p>
// //                   <p><strong>Experience:</strong> {doctor.experience} years</p>
// //                   <p><strong>Consultation Fee:</strong> ${doctor.fees}</p>
// //                 </div>
// //                 <button
// //                   className="btn book-btn"
// //                   onClick={() => {
// //                     setBookingDetails({ ...bookingDetails, doctorId: doctor._id });
// //                     setShowBooking(true);
// //                   }}
// //                 >
// //                   Book Appointment
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {showBooking && (
// //           <div className="modal">
// //             <div className="modal-content">
// //               <h3>Book Appointment</h3>
// //               <form onSubmit={handleBooking}>
// //                 <input
// //                   type="date"
// //                   className="form-input"
// //                   value={bookingDetails.date}
// //                   onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
// //                   required
// //                   min={new Date().toISOString().split('T')[0]}
// //                 />
// //                 <input
// //                   type="time"
// //                   className="form-input"
// //                   value={bookingDetails.time}
// //                   onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
// //                   required
// //                 />
// //                 <div className="modal-actions">
// //                   <button type="submit" className="btn form-btn">Confirm Booking</button>
// //                   <button type="button" className="btn cancel-btn" onClick={() => setShowBooking(false)}>Cancel</button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </section>
// //       <Footer />
// //     </>
// //   );
// // }

// // export default Doctors;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Loading from "../components/Loading";
// import "../styles/doctors.css";

// axios.defaults.baseURL = "http://localhost:5002/api";

// function Doctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bookingDetails, setBookingDetails] = useState({
//     doctorId: "",
//     date: "",
//     time: ""
//   });
//   const [showBooking, setShowBooking] = useState(false);

//   useEffect(() => {
//     getDoctors();
//   }, []);

//   const getDoctors = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/doctors/get-doctors");
      
//       console.log("Raw doctor data from API:", data); // Debug: See what you're getting

//       // Function to extract and format doctor data properly
//       const formatDoctorData = (item) => {
//         // Case 1: If the item itself has all doctor properties
//         if (item.specialization && item.experience) {
//           return {
//             _id: item._id,
//             name: item.name || 
//                   (item.userId ? `${item.userId.firstname || ''} ${item.userId.lastname || ''}`.trim() : "Doctor") ||
//                   "Unknown Doctor",
//             specialization: item.specialization,
//             experience: item.experience,
//             fees: item.fees,
//             timing: item.timing || "Not specified",
//             originalData: item
//           };
//         }
        
//         // Case 2: If doctor data is nested under userId
//         if (item.userId) {
//           return {
//             _id: item._id,
//             name: item.userId.name || 
//                   `${item.userId.firstname || ''} ${item.userId.lastname || ''}`.trim() ||
//                   "Unknown Doctor",
//             specialization: item.specialization || "General",
//             experience: item.experience || 0,
//             fees: item.fees || 0,
//             timing: item.timing || "Not specified",
//             originalData: item
//           };
//         }
        
//         // Case 3: If doctor data is nested under doctorId
//         if (item.doctorId) {
//           return {
//             _id: item.doctorId._id || item._id,
//             name: item.doctorId.name || 
//                   `${item.doctorId.firstname || ''} ${item.doctorId.lastname || ''}`.trim() ||
//                   "Unknown Doctor",
//             specialization: item.doctorId.specialization || item.specialization || "General",
//             experience: item.doctorId.experience || item.experience || 0,
//             fees: item.doctorId.fees || item.fees || 0,
//             timing: item.doctorId.timing || item.timing || "Not specified",
//             originalData: item
//           };
//         }
        
//         // Case 4: If it's a user object with doctor properties
//         if (item.firstname || item.lastname) {
//           return {
//             _id: item._id,
//             name: `${item.firstname || ''} ${item.lastname || ''}`.trim() || "Unknown Doctor",
//             specialization: item.specialization || "General",
//             experience: item.experience || 0,
//             fees: item.fees || 0,
//             timing: item.timing || "Not specified",
//             originalData: item
//           };
//         }
        
//         // Default case: return item as is
//         return {
//           _id: item._id || Math.random().toString(),
//           name: "Doctor",
//           specialization: "General",
//           experience: 0,
//           fees: 0,
//           timing: "Not specified",
//           originalData: item
//         };
//       };

//       // Process the data array
//       let doctorsList = [];
      
//       if (Array.isArray(data)) {
//         doctorsList = data;
//       } else if (data.doctors && Array.isArray(data.doctors)) {
//         doctorsList = data.doctors;
//       } else if (data.data && Array.isArray(data.data)) {
//         doctorsList = data.data;
//       } else {
//         console.error("Unexpected data format:", data);
//         setDoctors([]);
//         setLoading(false);
//         return;
//       }

//       // Remove duplicates using Map (based on _id)
//       const uniqueDoctorMap = new Map();
      
//       doctorsList.forEach(item => {
//         const formattedDoctor = formatDoctorData(item);
        
//         // Only add if we don't already have this doctor ID
//         if (!uniqueDoctorMap.has(formattedDoctor._id)) {
//           uniqueDoctorMap.set(formattedDoctor._id, formattedDoctor);
//         } else {
//           console.log("Duplicate doctor found and removed:", formattedDoctor.name);
//         }
//       });

//       // Convert Map back to array
//       const uniqueDoctors = Array.from(uniqueDoctorMap.values());
      
//       console.log("Unique doctors after processing:", uniqueDoctors);
//       setDoctors(uniqueDoctors);
//       setLoading(false);
      
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//       toast.error("Failed to load doctors");
//       setLoading(false);
//     }
//   };

//   const handleBooking = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         toast.error("Please login to book an appointment");
//         return;
//       }

//       await axios.post(
//         "/appointment/book",
//         {
//           doctorId: bookingDetails.doctorId,
//           date: bookingDetails.date,
//           time: bookingDetails.time
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       toast.success("Appointment booked successfully");
//       setShowBooking(false);
//       setBookingDetails({ doctorId: "", date: "", time: "" });
      
//       // Refresh doctors list to update any changes
//       getDoctors();
      
//     } catch (error) {
//       console.error("Booking error:", error);
//       toast.error(error.response?.data?.message || "Failed to book appointment");
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <>
//       <Navbar />
//       <section className="doctors-section">
//         <h2 className="page-heading">Available Doctors</h2>

//         {doctors.length === 0 ? (
//           <div className="no-doctors-container">
//             <p className="no-doctors">No Doctors Available</p>
//             <p className="no-doctors-sub">Please check back later</p>
//           </div>
//         ) : (
//           <>
//             <p className="doctors-count">Found {doctors.length} doctor(s)</p>
//             <div className="doctors-grid">
//               {doctors.map((doctor) => (
//                 <div className="doctor-card" key={doctor._id}>
//                   <div className="doctor-info">
//                     <h3>{doctor.name || "Doctor"}</h3>
//                     <p><strong>Specialization:</strong> {doctor.specialization || "Not specified"}</p>
//                     <p><strong>Experience:</strong> {doctor.experience || 0} years</p>
//                     <p><strong>Consultation Fee:</strong> ${doctor.fees || 0}</p>
//                     <p><strong>Timing:</strong> {doctor.timing || "Not specified"}</p>
//                   </div>
//                   <button
//                     className="btn book-btn"
//                     onClick={() => {
//                       setBookingDetails({ 
//                         doctorId: doctor._id, 
//                         date: "", 
//                         time: "" 
//                       });
//                       setShowBooking(true);
//                     }}
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Booking Modal */}
//         {showBooking && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h3>Book Appointment</h3>
//               <form onSubmit={handleBooking}>
//                 <div className="form-group">
//                   <label>Select Date:</label>
//                   <input
//                     type="date"
//                     className="form-input"
//                     value={bookingDetails.date}
//                     onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
//                     required
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label>Select Time:</label>
//                   <input
//                     type="time"
//                     className="form-input"
//                     value={bookingDetails.time}
//                     onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
//                     required
//                   />
//                 </div>
                
//                 <div className="modal-actions">
//                   <button type="submit" className="btn form-btn">Confirm Booking</button>
//                   <button 
//                     type="button" 
//                     className="btn cancel-btn" 
//                     onClick={() => {
//                       setShowBooking(false);
//                       setBookingDetails({ doctorId: "", date: "", time: "" });
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </section>
//       <Footer />
//     </>
//   );
// }

// export default Doctors;
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "../styles/doctors.css";

axios.defaults.baseURL = "http://localhost:5002/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    doctorId: "",
    date: "",
    time: ""
  });
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/doctors/get-doctors");
      setDoctors(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors");
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        "/appointment/book",
        {
          doctorId: bookingDetails.doctorId,
          date: bookingDetails.date,
          time: bookingDetails.time
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Appointment booked successfully");
      setShowBooking(false);
      setBookingDetails({ doctorId: "", date: "", time: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <section className="doctors-section">
        <h2 className="page-heading">Available Doctors</h2>

        {doctors.length === 0 ? (
          <p className="no-doctors">No Doctors Available</p>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor._id}>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Consultation Fee:</strong> ${doctor.fees}</p>
                </div>
                <button
                  className="btn book-btn"
                  onClick={() => {
                    setBookingDetails({ ...bookingDetails, doctorId: doctor._id });
                    setShowBooking(true);
                  }}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {showBooking && (
          <div className="modal">
            <div className="modal-content">
              <h3>Book Appointment</h3>
              <form onSubmit={handleBooking}>
                <input
                  type="date"
                  className="form-input"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  className="form-input"
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="btn form-btn">Confirm Booking</button>
                  <button type="button" className="btn cancel-btn" onClick={() => setShowBooking(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Doctors;