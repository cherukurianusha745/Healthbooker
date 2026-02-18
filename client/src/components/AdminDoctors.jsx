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

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.root);

//   const getAllDoctors = async (e) => {
//     try {
//       dispatch(setLoading(true));
//       const temp = await fetchData(`/doctor/getalldoctors`);
//       setDoctors(temp);
//       dispatch(setLoading(false));
//     } catch (error) {}
//   };

//   const deleteUser = async (userId) => {
//     try {
//       const confirm = window.confirm("Are you sure you want to delete?");
//       if (confirm) {
//         await toast.promise(
//           axios.put(
//             "/doctor/deletedoctor",
//             { userId },
//             {
//               headers: {
//                 authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           ),
//           {
//             success: "Doctor deleted successfully",
//             error: "Unable to delete Doctor",
//             loading: "Deleting Doctor...",
//           }
//         );
//         getAllDoctors();
//       }
//     } catch (error) {
//       return error;
//     }
//   };

//   useEffect(() => {
//     getAllDoctors();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <section className="user-section">
//           <h3 className="home-sub-heading">All Doctors</h3>
//           {doctors.length > 0 ? (
//             <div className="user-container">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Pic</th>
//                     <th>First Name</th>
//                     <th>Last Name</th>
//                     <th>Email</th>
//                     <th>Mobile No.</th>
//                     <th>Experience</th>
//                     <th>Specialization</th>
//                     <th>Fees</th>
//                     <th>Remove</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {doctors?.map((ele, i) => {
//                     return (
//                       <tr key={ele?._id}>
//                         <td>{i + 1}</td>
//                         <td>
//                           <img
//                             className="user-table-pic"
//                             src={ele?.userId?.pic}
//                             alt={ele?.userId?.firstname}
//                           />
//                         </td>
//                         <td>{ele?.userId?.firstname}</td>
//                         <td>{ele?.userId?.lastname}</td>
//                         <td>{ele?.userId?.email}</td>
//                         <td>{ele?.userId?.mobile}</td>
//                         <td>{ele?.experience}</td>
//                         <td>{ele?.specialization}</td>
//                         <td>{ele?.fees}</td>
//                         <td className="select">
//                           <button
//                             className="btn user-btn"
//                             onClick={() => {
//                               deleteUser(ele?.userId?._id);
//                             }}
//                           >
//                             Remove
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

// export default AdminDoctors;
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/adminDoctors.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/doctors/get-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor({
      _id: doctor._id,
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience || 0,
      fees: doctor.fees || 0,
      timing: doctor.timing || "morning",
      qualification: doctor.qualification || "",
      hospital: doctor.hospital || "",
      status: doctor.status || "approved"
    });
    setShowEditModal(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `/doctors/update-doctor/${editingDoctor._id}`,
        editingDoctor,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.data.success) {
        toast.success("Doctor updated successfully");
        setShowEditModal(false);
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  const handleStatusChange = async (doctorId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.patch(
        `/doctors/update-doctor-status/${doctorId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDoctor(prev => ({
      ...prev,
      [name]: name === "experience" || name === "fees" ? Number(value) : value
    }));
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="admin-doctors-container">
      <div className="admin-header">
        <h2>Manage Doctors</h2>
        <button className="btn-refresh" onClick={fetchDoctors}>
          Refresh List
        </button>
      </div>

      <div className="doctors-table-container">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Fees ($)</th>
              <th>Timing</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor._id}>
                <td>{doctor.name || "N/A"}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience} years</td>
                <td>${doctor.fees}</td>
                <td>{doctor.timing || "N/A"}</td>
                <td>
                  <select
                    className={`status-select status-${doctor.status}`}
                    value={doctor.status}
                    onChange={(e) => handleStatusChange(doctor._id, e.target.value)}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditClick(doctor)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Doctor</h3>
            <form onSubmit={handleUpdateDoctor}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingDoctor.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Specialization:</label>
                <input
                  type="text"
                  name="specialization"
                  value={editingDoctor.specialization}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Experience (years):</label>
                  <input
                    type="number"
                    name="experience"
                    value={editingDoctor.experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Fees ($):</label>
                  <input
                    type="number"
                    name="fees"
                    value={editingDoctor.fees}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Timing:</label>
                <select
                  name="timing"
                  value={editingDoctor.timing}
                  onChange={handleInputChange}
                  required
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>

              <div className="form-group">
                <label>Qualification:</label>
                <input
                  type="text"
                  name="qualification"
                  value={editingDoctor.qualification || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Hospital:</label>
                <input
                  type="text"
                  name="hospital"
                  value={editingDoctor.hospital || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;