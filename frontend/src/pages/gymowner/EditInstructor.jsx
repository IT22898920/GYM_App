import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiArrowLeft,
  FiSave,
  FiX,
  FiClock,
  FiPlus,
  FiTrash2
} from "react-icons/fi";

function EditInstructor() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructor, setInstructor] = useState(null);
  const [formData, setFormData] = useState({
    specialization: "",
    salary: "",
    startDate: "",
    description: "",
    isActive: true,
    schedule: []
  });

  const [newSchedule, setNewSchedule] = useState({
    day: "monday",
    startTime: "",
    endTime: "",
    className: ""
  });

  const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ];

  useEffect(() => {
    fetchInstructorDetails();
  }, [instructorId]);

  const fetchInstructorDetails = async () => {
    try {
      setLoading(true);
      // Get gym owner's gyms first
      const gymsResponse = await api.getGymsByOwner();
      if (!gymsResponse.success || gymsResponse.data.length === 0) {
        showAlert('No gyms found', 'error');
        navigate('/gym-owner/instructors');
        return;
      }

      // Find the instructor in one of the gyms
      let foundInstructor = null;
      let foundGymId = null;

      for (const gym of gymsResponse.data) {
        const instructorsResponse = await api.getGymInstructors(gym._id);
        if (instructorsResponse.success) {
          const instructor = instructorsResponse.data.find(i => i._id === instructorId);
          if (instructor) {
            foundInstructor = instructor;
            foundGymId = gym._id;
            break;
          }
        }
      }

      if (!foundInstructor) {
        showAlert('Instructor not found', 'error');
        navigate('/gym-owner/instructors');
        return;
      }

      setInstructor(foundInstructor);
      setFormData({
        specialization: foundInstructor.specialization || "",
        salary: foundInstructor.salary || "",
        startDate: foundInstructor.startDate ? new Date(foundInstructor.startDate).toISOString().split('T')[0] : "",
        description: foundInstructor.description || "",
        isActive: foundInstructor.isActive !== undefined ? foundInstructor.isActive : true,
        schedule: foundInstructor.schedule || [],
        gymId: foundGymId
      });
    } catch (error) {
      console.error('Error fetching instructor:', error);
      showAlert('Failed to fetch instructor details', 'error');
      navigate('/gym-owner/instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSchedule = () => {
    if (!newSchedule.startTime || !newSchedule.endTime || !newSchedule.className) {
      showAlert('Please fill all schedule fields', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { ...newSchedule, id: Date.now() }]
    }));

    setNewSchedule({
      day: "monday",
      startTime: "",
      endTime: "",
      className: ""
    });
  };

  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare the update data
      const updateData = {
        specialization: formData.specialization,
        salary: formData.salary ? Number(formData.salary) : null,
        startDate: formData.startDate || null,
        description: formData.description,
        isActive: formData.isActive,
        schedule: formData.schedule
      };
      
      // Call the API to update the instructor
      await api.updateGymInstructor(formData.gymId, instructorId, updateData);
      
      showAlert('Instructor details updated successfully!', 'success');
      
      setTimeout(() => {
        navigate('/gym-owner/instructors');
      }, 1500);
    } catch (error) {
      console.error('Error updating instructor:', error);
      showAlert(error.message || 'Failed to update instructor', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Instructor not found</h2>
        <Link
          to="/gym-owner/instructors"
          className="text-violet-400 hover:text-violet-300"
        >
          Back to Instructors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/gym-owner/instructors"
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Edit Instructor
            </h1>
            <p className="text-gray-400 mt-1">
              Update instructor information
            </p>
          </div>
        </div>
      </div>

      {/* Instructor Info Card */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={`https://ui-avatars.com/api/?name=${instructor.instructor?.firstName || 'Unknown'}+${instructor.instructor?.lastName || 'User'}&background=8b5cf6&color=fff&size=150`}
            alt={`${instructor.instructor?.firstName || 'Unknown'} ${instructor.instructor?.lastName || 'User'}`}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-white">
              {instructor.instructor?.firstName || 'Unknown'} {instructor.instructor?.lastName || 'User'}
            </h2>
            <p className="text-gray-400">{instructor.instructor?.email || 'No email'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FiActivity className="inline w-4 h-4 mr-2" />
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="e.g., Yoga, Strength Training"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FiDollarSign className="inline w-4 h-4 mr-2" />
                Monthly Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-violet-600 bg-gray-900 border-gray-700 rounded focus:ring-violet-500"
                />
                <span className="text-gray-300">Active Instructor</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiFileText className="inline w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none resize-none"
              placeholder="Additional notes about the instructor..."
            />
          </div>

          {/* Schedule Management */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiClock className="w-5 h-5 mr-2" />
              Class Schedule
            </h3>

            {/* Add New Schedule */}
            <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  name="day"
                  value={newSchedule.day}
                  onChange={handleScheduleChange}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-violet-500 focus:outline-none"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  name="startTime"
                  value={newSchedule.startTime}
                  onChange={handleScheduleChange}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-violet-500 focus:outline-none"
                  placeholder="Start Time"
                />

                <input
                  type="time"
                  name="endTime"
                  value={newSchedule.endTime}
                  onChange={handleScheduleChange}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-violet-500 focus:outline-none"
                  placeholder="End Time"
                />

                <input
                  type="text"
                  name="className"
                  value={newSchedule.className}
                  onChange={handleScheduleChange}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-violet-500 focus:outline-none"
                  placeholder="Class Name"
                />
              </div>

              <button
                type="button"
                onClick={addSchedule}
                className="mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Schedule
              </button>
            </div>

            {/* Schedule List */}
            {formData.schedule.length > 0 && (
              <div className="space-y-2">
                {formData.schedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-4 text-gray-300">
                      <span className="font-medium">
                        {schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1)}
                      </span>
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                      <span className="text-violet-400">{schedule.className}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <Link
              to="/gym-owner/instructors"
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInstructor;