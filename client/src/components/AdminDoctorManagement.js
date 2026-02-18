// components/AdminDoctorManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/adminDoctors.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const AdminDoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [bulkUpdateData, setBulkUpdateData] = useState({
    status: "",
    fees: "",
    timing: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch all doctors
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

  // Get single doctor by ID
  const getDoctorById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/doctors/get-doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.doctor;
    } catch (error) {
      console.error("Error fetching doctor:", error);
      toast.error("Failed to fetch doctor details");
      return null;
    }
  };

  // Open edit modal
  const handleEditClick = async (doctor) => {
    const fullDoctor = await getDoctorById(doctor._id);
    setEditingDoctor(fullDoctor || doctor);
    setShowEditModal(true);
  };

  // Update single doctor
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
        fetchDoctors(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  // Update doctor status
  const handleUpdateStatus = async (doctorId, newStatus) => {
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

  // Select/Deselect doctors for bulk update
  const toggleDoctorSelection = (doctorId) => {
    setSelectedDoctors(prev => 
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  // Select all doctors
  const selectAllDoctors = () => {
    if (selectedDoctors.length === doctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(doctors.map(d => d._id));
    }
  };

  // Bulk update doctors
  const handleBulkUpdate = async (e) => {
    e.preventDefault();
    
    if (selectedDoctors.length === 0) {
      toast.error("Please select at least one doctor");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      // Remove empty fields
      const updateData = {};
      if (bulkUpdateData.status) updateData.status = bulkUpdateData.status;
      if (bulkUpdateData.fees) updateData.fees = Number(bulkUpdateData.fees);
      if (bulkUpdateData.timing) updateData.timing = bulkUpdateData.timing;
      
      const response = await axios.put(
        "/doctors/bulk-update-doctors",
        {
          doctorIds: selectedDoctors,
          updateData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        setShowBulkEditModal(false);
        setSelectedDoctors([]);
        setBulkUpdateData({ status: "", fees: "", timing: "" });
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to update doctors");
    }
  };

  // Handle input change in edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="admin-doctor-management">
      <div className="header">
        <h2>Manage Doctors</h2>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowBulkEditModal(true)}
            disabled={selectedDoctors.length === 0}
          >
            Bulk Edit ({selectedDoctors.length})
          </button>
          <button className="btn btn-secondary" onClick={fetchDoctors}>
            Refresh
          </button>
        </div>
      </div>

      {/* Select All Checkbox */}
      <div className="select-all">
        <label>
          <input
            type="checkbox"
            checked={selectedDoctors.length === doctors.length && doctors.length > 0}
            onChange={selectAllDoctors}
          />
          Select All ({doctors.length} doctors)
        </label>
      </div>

      {/* Doctors Table */}
      <table className="doctors-table">
        <thead>
          <tr>
            <th>Select</th>
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
              <td>
                <input
                  type="checkbox"
                  checked={selectedDoctors.includes(doctor._id)}
                  onChange={() => toggleDoctorSelection(doctor._id)}
                />
              </td>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.experience} years</td>
              <td>${doctor.fees}</td>
              <td>{doctor.timing}</td>
              <td>
                <span className={`status-badge status-${doctor.status}`}>
                  {doctor.status}
                </span>
              </td>
              <td>
                <button 
                  className="btn-edit"
                  onClick={() => handleEditClick(doctor)}
                >
                  Edit
                </button>
                <select
                  className="status-select"
                  value={doctor.status}
                  onChange={(e) => handleUpdateStatus(doctor._id, e.target.value)}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Single Doctor Modal */}
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
                  value={editingDoctor.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Specialization:</label>
                <input
                  type="text"
                  name="specialization"
                  value={editingDoctor.specialization || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Experience (years):</label>
                <input
                  type="number"
                  name="experience"
                  value={editingDoctor.experience || ""}
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
                  value={editingDoctor.fees || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Timing:</label>
                <select
                  name="timing"
                  value={editingDoctor.timing || "morning"}
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
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Update Doctor
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Bulk Edit Doctors ({selectedDoctors.length} selected)</h3>
            <form onSubmit={handleBulkUpdate}>
              <div className="form-group">
                <label>Status (leave empty to skip):</label>
                <select
                  value={bulkUpdateData.status}
                  onChange={(e) => setBulkUpdateData({...bulkUpdateData, status: e.target.value})}
                >
                  <option value="">-- Keep Current --</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Fees ($) (leave empty to skip):</label>
                <input
                  type="number"
                  value={bulkUpdateData.fees}
                  onChange={(e) => setBulkUpdateData({...bulkUpdateData, fees: e.target.value})}
                  min="0"
                  placeholder="Enter fees"
                />
              </div>
              
              <div className="form-group">
                <label>Timing (leave empty to skip):</label>
                <select
                  value={bulkUpdateData.timing}
                  onChange={(e) => setBulkUpdateData({...bulkUpdateData, timing: e.target.value})}
                >
                  <option value="">-- Keep Current --</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Apply to Selected
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowBulkEditModal(false)}
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

export default AdminDoctorManagement;