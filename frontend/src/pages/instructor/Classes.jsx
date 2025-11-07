import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiUsers, FiCalendar, FiClock, FiDollarSign, FiX } from "react-icons/fi";
import api from "../../utils/api";
import { useAlert } from "../../contexts/AlertContext";

function Classes() {
  const { showSuccess, showError } = useAlert();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibleMembers, setEligibleMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // For multiple member selection
  const [selectedMember, setSelectedMember] = useState(""); // For add member modal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    capacity: 20,
    package: "standard",
      selectedMembers: [], // Member IDs to add to the class
  });

  const classTypes = [
    "Yoga",
    "HIIT",
    "Strength Training",
    "Pilates",
    "CrossFit",
    "Cardio",
    "Other"
  ];

  const packageOptions = [
    { name: "standard", capacity: 20, price: 0 },
    { name: "20-50", capacity: 50, price: 49.99 },
    { name: "50+", capacity: 100, price: 99.99 },
  ];

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch eligible members when opening create or add member modal
  useEffect(() => {
    if (showCreateModal || showEditModal || showAddMemberModal) {
      fetchEligibleMembers();
    }
  }, [showCreateModal, showEditModal, showAddMemberModal]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.getInstructorClasses();
      
      if (response.success) {
        setClasses(response.data || []);
      } else {
        console.error('Failed to fetch classes:', response.message);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleMembers = async () => {
    try {
      // Use the same endpoint as Assigned Members page
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setEligibleMembers([]);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/instructors/assigned-members?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch assigned members');
      }

      const data = await response.json();
      if (data.success) {
        setEligibleMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching eligible members:', error);
      setEligibleMembers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create class data without selectedMembers
      const { selectedMembers, ...classData } = formData;
      
      console.log('Creating class with data:', classData);
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Exists' : 'Missing');
      
      const response = await api.createClass(classData);
      
      if (response.success) {
        // Add selected members to the class
        if (selectedMembers && selectedMembers.length > 0) {
          const addMembersPromises = selectedMembers.map(memberId =>
            api.addMemberToClass(response.data._id, memberId)
          );
          await Promise.all(addMembersPromises);
        }
        
        showSuccess('Class created successfully!');
        setShowCreateModal(false);
        fetchClasses();
        // Reset form
        setFormData({
          name: "",
          description: "",
          type: "",
          date: "",
          time: "",
          duration: "",
          price: "",
          capacity: 20,
          package: "standard",
          selectedMembers: [],
        });
        setSelectedMembers([]);
      } else {
        showError(response.message || 'Failed to create class');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      showError('Failed to create class');
    }
  };

  // Handle member selection for create modal
  const handleMemberSelection = (memberId) => {
    setSelectedMembers(prev => {
      let newSelection;
      if (prev.includes(memberId)) {
        newSelection = prev.filter(id => id !== memberId);
      } else {
        newSelection = [...prev, memberId];
      }
      // Also update formData
      setFormData(formData => ({
        ...formData,
        selectedMembers: newSelection
      }));
      return newSelection;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.updateClass(selectedClass._id, formData);
      
      if (response.success) {
        showSuccess('Class updated successfully!');
        setShowEditModal(false);
        setSelectedClass(null);
        fetchClasses();
      } else {
        showError(response.message || 'Failed to update class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      showError('Failed to update class');
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const response = await api.deleteClass(classId);
      
      if (response.success) {
        showSuccess('Class deleted successfully!');
        fetchClasses();
      } else {
        showError(response.message || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      showError('Failed to delete class');
    }
  };

  const handleEdit = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || "",
      type: classItem.type,
      date: new Date(classItem.date).toISOString().split('T')[0],
      time: classItem.time,
      duration: classItem.duration.toString(),
      price: classItem.price.toString(),
      capacity: classItem.capacity,
      package: classItem.package || "standard",
    });
    setShowEditModal(true);
  };

  const handleAddMember = async () => {
    if (!selectedMember) {
      showError('Please select a member');
      return;
    }

    try {
      const response = await api.addMemberToClass(selectedClass._id, selectedMember);
      
      if (response.success) {
        showSuccess('Member added to class successfully!');
        setShowAddMemberModal(false);
        setSelectedMember("");
        fetchClasses();
      } else {
        showError(response.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      showError(error.message || 'Failed to add member to class');
    }
  };

  const handleRemoveMember = async (classId, memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the class?')) {
      return;
    }

    try {
      const response = await api.removeMemberFromClass(classId, memberId);
      
      if (response.success) {
        showSuccess('Member removed from class successfully!');
        fetchClasses();
      } else {
        showError(response.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      showError('Failed to remove member from class');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            My Classes
          </h1>
          <p className="text-gray-400 mt-1">Manage your fitness classes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create New Class</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-12 border border-gray-700/50 text-center">
          <FiCalendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Classes Yet</h3>
          <p className="text-gray-400 mb-6">Create your first class to get started!</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
              key={cls._id}
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-colors"
          >
              <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">{cls.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setSelectedClass(cls); setShowAddMemberModal(true); }}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Add Member"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(cls)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                <FiEdit2 className="w-5 h-5" />
              </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
              </div>

              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(cls.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>{cls.time} ({cls.duration} min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="w-4 h-4" />
                  <span>${cls.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="w-4 h-4" />
                  <span>{cls.enrolledMembers || 0} / {cls.capacity} students</span>
                </div>
                {cls.type && (
                  <span className="inline-block px-2 py-1 bg-violet-500/20 text-violet-400 rounded text-sm">
                    {cls.type}
                  </span>
                )}
              </div>

              {/* Show enrolled members */}
              {cls.members && cls.members.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Enrolled Members:</h4>
                  <div className="space-y-1">
                    {cls.members.map((memberData, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {memberData.member?.firstName} {memberData.member?.lastName}
                        </span>
                        <button
                          onClick={() => handleRemoveMember(cls._id, memberData.member._id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove Member"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => {
              setShowCreateModal(false);
              setSelectedMembers([]);
            }}></div>
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Class Name"
                  value={formData.name}
                onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                required
              />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="3"
              />
              
              <div>
                <label className="block text-gray-300 mb-2">Select Type</label>
              <select
                name="type"
                  value={formData.type}
                onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                required
              >
                <option value="">Select Type</option>
                {classTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              </div>
              {/* Member Selection Dropdown */}
                <div>
                  <label className="block text-gray-300 mb-2">Select Members</label>
                  <div className="relative">
                    <select
                      value={selectedMembers[selectedMembers.length - 1] || ""}
                      onChange={(e) => {
                        const memberId = e.target.value;
                        if (memberId && !selectedMembers.includes(memberId)) {
                          const newSelection = [...selectedMembers, memberId];
                          setSelectedMembers(newSelection);
                          setFormData(formData => ({
                            ...formData,
                            selectedMembers: newSelection
                          }));
                        }
                        // Reset select to show placeholder
                        e.target.value = "";
                      }}
                      className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    >
                      <option value="">Select a member...</option>
                      {eligibleMembers
                        .filter(member => !selectedMembers.includes(member._id))
                        .map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.firstName} {member.lastName} ({member.isFreelance ? 'Freelancing' : 'Not Freelancing'})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Display selected members */}
                  {selectedMembers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-400">{selectedMembers.length} member(s) selected:</p>
                      <div className="space-y-2">
                        {selectedMembers.map((memberId) => {
                          const member = eligibleMembers.find(m => m._id === memberId);
                          if (!member) return null;
                          return (
                            <div key={memberId} className="flex items-center justify-between p-2 bg-violet-600/20 border border-violet-500/30 rounded-lg">
                              <span className="text-white text-sm">
                                {member.firstName} {member.lastName} ({member.isFreelance ? 'Freelancing' : 'Not Freelancing'})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSelection = selectedMembers.filter(id => id !== memberId);
                                  setSelectedMembers(newSelection);
                                  setFormData(formData => ({
                                    ...formData,
                                    selectedMembers: newSelection
                                  }));
                                }}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                    value={formData.date}
                onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                required
              />
              <input
                type="time"
                name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duration (minutes)"
                    value={formData.duration}
                onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                required
              />
              <input
                type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                onChange={handleChange}
                    step="0.01"
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                required
              />
                </div>
                <input
                  type="text"
                  value={formData.capacity}
                  readOnly
                  placeholder="Class Limit"
                  className="w-full p-3 bg-gray-700 text-gray-400 rounded-lg border border-gray-700 cursor-not-allowed"
                />
                
                
                <div className="flex gap-3">
              <button
                type="submit"
                    className="flex-1 p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Create Class
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedMembers([]);
                }}
                className="flex-1 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
                </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => { setShowEditModal(false); setSelectedClass(null); }}></div>
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Class</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Class Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  rows="3"
                />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  required
                >
                  <option value="">Select Type</option>
                  {classTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duration (minutes)"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    required
                  />
                </div>
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Update Class
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setSelectedClass(null); }}
                    className="flex-1 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => { setShowAddMemberModal(false); setSelectedClass(null); setSelectedMember(""); }}></div>
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Add Member to Class</h2>
              <p className="text-gray-400 mb-4">{selectedClass.name}</p>
              
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none mb-4"
              >
                <option value="">Select a member</option>
                {eligibleMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName} ({member.email})
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={handleAddMember}
                  className="flex-1 p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Add Member
                </button>
                <button
                  onClick={() => { setShowAddMemberModal(false); setSelectedClass(null); setSelectedMember(""); }}
                  className="flex-1 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;

