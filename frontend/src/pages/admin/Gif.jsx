import { useState, useEffect } from "react";
import { FiUpload, FiImage, FiPlus, FiEye, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

function Gif() {
  const [gifData, setGifData] = useState({
    name: "",
    gifFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [workoutError, setWorkoutError] = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "gif" && files) {
      setGifData(prev => ({
        ...prev,
        gifFile: files[0]
      }));
    } else {
      setGifData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gifData.name.trim()) {
      setMessage("Please enter a name for the GIF");
      return;
    }
    
    if (!gifData.gifFile) {
      setMessage("Please select a GIF file");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('name', gifData.name);
      formData.append('gif', gifData.gifFile);

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`${apiBase}/gifs/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || 'Upload failed');
      }

      if (isEditing) {
        try {
          const delRes = await fetch(`${apiBase}/gifs/${editingWorkout}`, {
            method: 'DELETE',
            headers: {
              Authorization: token ? `Bearer ${token}` : ''
            }
          });
          if (!delRes.ok) {
            console.warn('Failed to delete previous workout while updating.');
          }
        } catch (err) {
          console.error('Error deleting previous workout:', err);
        }
        setWorkouts(prev => prev.filter(w => w._id !== editingWorkout));
        setMessage("Workout updated successfully!");
        setIsEditing(false);
        setEditingWorkout(null);
      } else {
        setMessage("GIF uploaded successfully!");
      }
      
      setGifData({
        name: "",
        gifFile: null
      });
      
      // Refresh workouts list if it's currently displayed
      if (showWorkouts) {
        fetchWorkouts();
      }
      
    } catch (error) {
      setMessage("Error uploading GIF. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(gifData);

  // Fetch workouts from the API
  const fetchWorkouts = async () => {
    try {
      setLoadingWorkouts(true);
      setWorkoutError("");
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${apiBase}/gifs`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setWorkouts(data.data);
      } else {
        setWorkoutError(data.message || 'Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkoutError('Failed to fetch workouts. Please try again.');
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // Toggle workout display
  const toggleWorkouts = () => {
    if (!showWorkouts) {
      fetchWorkouts();
    }
    setShowWorkouts(!showWorkouts);
  };

  // Show delete confirmation
  const showDeleteConfirm = (workout) => {
    setDeleteConfirm(workout);
  };

  // Delete workout after confirmation
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${apiBase}/gifs/${deleteConfirm._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        setWorkouts(prev => prev.filter(w => w._id !== deleteConfirm._id));
        setMessage("Workout deleted successfully!");
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      setMessage('Error deleting workout. Please try again.');
    }
  };

  // Navigate to upload form for editing
  const editWorkout = (workout) => {
    setGifData({
      name: workout.name,
      gifFile: null
    });
    setShowWorkouts(false);
    setIsEditing(true);
    setEditingWorkout(workout._id);
    setMessage(`Editing workout: ${workout.name}. Please upload a new GIF file.`);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-refresh workouts when component mounts if workouts are visible
  useEffect(() => {
    if (showWorkouts && workouts.length === 0) {
      fetchWorkouts();
    }
  }, [showWorkouts]);

  const resetForm = () => {
    setGifData({
      name: "",
      gifFile: null
    });
    setMessage("");
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isEditing ? 'Edit Workout' : 'Upload GIF'}
          </h1>
          <p className="text-gray-400">
            {isEditing ? 'Update your workout with a new GIF file' : 'Add new GIFs to your gym collection'}
          </p>
          
          
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GIF Name Input */}
            <div>
              <label className="block text-gray-300 mb-2 text-lg font-medium">
                Workout Name *
              </label>
              <input
                type="text"
                name="name"
                value={gifData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                placeholder="Enter a descriptive name for the GIF"
              />
            </div>

            {/* GIF File Upload */}
            <div>
              <label className="block text-gray-300 mb-2 text-lg font-medium">
                GIF File *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-violet-500 transition-colors">
                <input
                  type="file"
                  name="gif"
                  onChange={handleInputChange}
                  accept="image/gif"
                  required
                  className="hidden"
                  id="gif-upload"
                />
                <label htmlFor="gif-upload" className="cursor-pointer">
                  {gifData.gifFile ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gray-700 rounded-lg flex items-center justify-center">
                        <FiImage className="w-12 h-12 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{gifData.gifFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(gifData.gifFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <p className="text-violet-400 text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FiUpload className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-white text-lg font-medium">Click to upload GIF</p>
                        <p className="text-gray-400 text-sm">or drag and drop</p>
                      </div>
                      <p className="text-gray-500 text-sm">Only GIF files are supported</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
           

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("successfully") 
                  ? "bg-green-900/20 border border-green-500/30 text-green-400" 
                  : "bg-red-900/20 border border-red-500/30 text-red-400"
              }`}>
                <p className="text-center">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiPlus className="w-5 h-5" />
                    <span>{isEditing ? 'Update Workout' : 'Upload GIF'}</span>
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingWorkout(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
              
            </div>
             {/* View Workouts Button */}
          <div className="mt-4">
            <button
              onClick={toggleWorkouts}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FiEye className="w-5 h-5" />
              {showWorkouts ? 'Hide Workouts' : 'View Workouts'}
            </button>
          </div>
          </form>
        </div>

        {/* Workouts Display Section */}
        {showWorkouts && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Uploaded Workouts ({workouts.length})</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchWorkouts}
                  disabled={loadingWorkouts}
                  className="text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                  title="Refresh workouts"
                >
                  <div className={`w-5 h-5 ${loadingWorkouts ? 'animate-spin' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => setShowWorkouts(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {loadingWorkouts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading workouts...</p>
              </div>
            ) : workoutError ? (
              <div className="text-center py-8">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 mb-2">{workoutError}</p>
                  <button
                    onClick={fetchWorkouts}
                    className="text-red-300 hover:text-red-200 text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : workouts.length === 0 ? (
              <div className="text-center py-8">
                <FiImage className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No workouts uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                  <div key={workout._id} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-600 hover:border-violet-500">
                    {/* GIF Display */}
                    <div className="aspect-square bg-gray-800 flex items-center justify-center relative group">
                      <img
                        src={workout.url}
                        alt={workout.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-sm font-medium bg-black bg-opacity-70 px-3 py-1 rounded-full">
                            {workout.format || 'GIF'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Workout Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-lg truncate group-hover:text-violet-300 transition-colors">
                          {workout.name}
                        </h4>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => editWorkout(workout)}
                            className="p-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 rounded transition-colors"
                            title="Edit workout"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => showDeleteConfirm(workout)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                            title="Delete workout"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(workout.createdAt).toLocaleDateString()}
                          </span>
                          {workout.uploadedBy && (
                            <span className="text-violet-400 font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        {workout.size && (
                          <div className="text-xs text-gray-500">
                            Size: {(workout.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}



        {/* Instructions */}
        {/* <div className="mt-8 bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Enter a descriptive name for your workout</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Select a GIF file (only .gif format supported)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Click "Upload GIF" to add it to your collection</span>
            </li>
          </ul>
        </div> */}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Delete Workout</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="text-white font-medium">"{deleteConfirm.name}"</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gif;
