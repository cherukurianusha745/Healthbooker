// import React, { useState } from "react";
// import "../styles/bookappointment.css";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { IoMdClose } from "react-icons/io";

// const BookAppointment = ({ setModalOpen, ele }) => {
//   const [formDetails, setFormDetails] = useState({
//     date: "",
//     time: "",
//   });

//   const inputChange = (e) => {
//     const { name, value } = e.target;
//     setFormDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const bookAppointment = async (e) => {
//     e.preventDefault();

//     if (!formDetails.date || !formDetails.time) {
//       toast.error("Please select date and time");
//       return;
//     }

//     try {
//       await toast.promise(
//         axios.post(
//           "/api/appointment/bookappointment",
//           {
//             doctorId: ele?._id,
//             date: formDetails.date,
//             time: formDetails.time,
//             doctorname: ele?.name,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         ),
//         {
//           loading: "Booking appointment...",
//           success: "Appointment booked successfully",
//           error: "Unable to book appointment",
//         }
//       );

//       setModalOpen(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="modal flex-center">
//       <div className="modal__content">
//         <h2 className="page-heading">Book Appointment</h2>

//         <IoMdClose
//           className="close-btn"
//           onClick={() => setModalOpen(false)}
//         />

//         <div className="register-container flex-center book">
//           <form className="register-form" onSubmit={bookAppointment}>
//             <input
//               type="date"
//               name="date"
//               className="form-input"
//               value={formDetails.date}
//               onChange={inputChange}
//               required
//             />

//             <input
//               type="time"
//               name="time"
//               className="form-input"
//               value={formDetails.time}
//               onChange={inputChange}
//               required
//             />

//             <button type="submit" className="btn form-btn">
//               Book
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/book-appointment.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: ""
  });

  // Fetch available doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/get-approved-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/appointment/book",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Booking response:", response.data);
      toast.success("✅ Appointment booked successfully! Waiting for admin approval.");
      
      // Reset form
      setFormData({
        doctorId: "",
        date: "",
        time: ""
      });

      // Navigate to appointments page after 2 seconds
      setTimeout(() => {
        navigate("/my-appointments");
      }, 2000);

    } catch (error) {
      console.error("Booking error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="book-appointment-container">
      <div className="booking-header">
        <h1>Book Appointment</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="booking-form-container">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name} - {doctor.specialization} (${doctor.fees})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="date"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>

        <div className="booking-info">
          <h3>Appointment Process:</h3>
          <ol>
            <li>📝 Fill the appointment details</li>
            <li>⏳ Wait for admin approval (usually within 24 hours)</li>
            <li>👨‍⚕️ Doctor will confirm after admin approval</li>
            <li>✅ You'll receive notifications at each step</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;