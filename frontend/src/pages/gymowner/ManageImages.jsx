import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUpload,
  FiTrash2,
  FiImage,
  FiCamera,
  FiSave,
  FiX,
  FiPlus,
} from "react-icons/fi";
import axios from "axios";

function ManageImages() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [gymData, setGymData] = useState(null);

  // Image states
  const [currentLogo, setCurrentLogo] = useState(null);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]); // Track deleted photos
  const [newLogo, setNewLogo] = useState(null);
  const [newPhotos, setNewPhotos] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [photosPreviews, setPhotosPreviews] = useState([]);

  // Load existing gym data
  useEffect(() => {
    loadGymData();
  }, []);

  const loadGymData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gyms/owner/gyms`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const gym = response.data.data[0];
        console.log("Gym data:", gym); // Debug log
        setGymId(gym._id);
        setGymData(gym);
        setCurrentLogo(gym.logo);
        
        // Handle different possible photo array structures
        let photos = [];
        if (Array.isArray(gym.photos)) {
          photos = gym.photos;
        } else if (Array.isArray(gym.images)) {
          photos = gym.images;
        } else if (gym.media && Array.isArray(gym.media.photos)) {
          photos = gym.media.photos;
        }
        
        setCurrentPhotos(Array.isArray(photos) ? photos : []);
        console.log("Loaded photos:", photos); // Debug log
      }
    } catch (error) {
      console.error("Error loading gym data:", error);
      setError("Failed to load gym data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB.');
        return;
      }

      setNewLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files.');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB.');
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      return; // Some files were invalid
    }

    setNewPhotos(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotosPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setError(null);
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeCurrentPhoto = (index) => {
    const photoToDelete = currentPhotos[index];
    setDeletedPhotos(prev => [...prev, photoToDelete]);
    // Don't remove from currentPhotos, just mark for deletion
    // setCurrentPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const deletePhotosFromServer = async () => {
    if (deletedPhotos.length === 0 || !gymId) return;

    try {
      // For each deleted photo, make a delete request
      const deletePromises = deletedPhotos.map(async (photo) => {
        // Use the publicId but URL encode it since it contains slashes
        const imageId = photo.publicId ? encodeURIComponent(photo.publicId) : photo._id;
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/gyms/${gymId}/images/${imageId}`,
          {
            withCredentials: true,
          }
        );
        return response;
      });

      await Promise.all(deletePromises);
      
      // Remove deleted photos from currentPhotos
      setCurrentPhotos(prev => prev.filter(photo => 
        !deletedPhotos.some(deleted => 
          deleted.publicId === photo.publicId || 
          deleted._id === photo._id || 
          deleted.url === photo.url
        )
      ));
      
      setDeletedPhotos([]); // Clear deleted photos after successful deletion
      return true;
    } catch (error) {
      console.error("Error deleting photos:", error);
      throw error;
    }
  };

  const uploadLogo = async () => {
    if (!newLogo || !gymId) return;

    const formData = new FormData();
    formData.append('logo', newLogo);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/gyms/${gymId}/upload-logo`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setCurrentLogo(response.data.data.logo);
        setNewLogo(null);
        setLogoPreview(null);
        return true;
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  };

  const uploadPhotos = async () => {
    if (newPhotos.length === 0 || !gymId) return;

    const formData = new FormData();
    newPhotos.forEach((photo, index) => {
      formData.append('images', photo);
      formData.append('captions', `Photo ${index + 1}`);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/gyms/${gymId}/upload-images`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        console.log("Upload response:", response.data); // Debug log
        const uploadedImages = response.data.data.uploadedImages || response.data.data.photos || [];
        if (Array.isArray(uploadedImages)) {
          setCurrentPhotos(prev => [...prev, ...uploadedImages]);
        }
        setNewPhotos([]);
        setPhotosPreviews([]);
        return true;
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!gymId) {
      setError("Gym ID not found. Please try refreshing the page.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Delete photos first if there are any to delete
      if (deletedPhotos.length > 0) {
        await deletePhotosFromServer();
      }

      // Upload logo if there's a new one
      if (newLogo) {
        await uploadLogo();
      }

      // Upload photos if there are new ones
      if (newPhotos.length > 0) {
        await uploadPhotos();
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error saving images:", error);
      setError(
        error.response?.data?.message || "Failed to save images. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/gym-owner")}
            className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Manage Photos & Logo
            </h1>
            <p className="text-gray-400 mt-1">Upload and manage your gym's visual content</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Pending changes indicator */}
          {(newLogo || newPhotos.length > 0 || deletedPhotos.length > 0) && (
            <div className="text-sm text-gray-400">
              {[
                newLogo && "New logo",
                newPhotos.length > 0 && `${newPhotos.length} new photo(s)`,
                deletedPhotos.length > 0 && `${deletedPhotos.length} photo(s) to delete`
              ].filter(Boolean).join(", ")}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving || (!newLogo && newPhotos.length === 0 && deletedPhotos.length === 0)}
            className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="h-5 w-5 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-green-300">
          Images updated successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Management */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FiImage className="h-5 w-5 mr-2" />
            Gym Logo
          </h2>

          {/* Current Logo */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Current Logo
            </label>
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700/50 border-2 border-gray-600 flex items-center justify-center">
              {currentLogo?.url ? (
                <img
                  src={currentLogo.url}
                  alt="Current gym logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <FiImage className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No logo uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* New Logo Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Upload New Logo
            </label>
            
            {logoPreview ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700/50 border-2 border-violet-500">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={() => {
                    setNewLogo(null);
                    setLogoPreview(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
                <input
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <FiUpload className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">Click to upload logo</p>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG (max 2MB)</p>
              </label>
            )}
          </div>
        </div>

        {/* Photos Management */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FiCamera className="h-5 w-5 mr-2" />
            Gym Photos
          </h2>

          {/* Upload New Photos */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Upload New Photos
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
              <input
                type="file"
                onChange={handlePhotosChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <FiPlus className="h-8 w-8 text-gray-500 mb-2" />
              <p className="text-gray-400 text-sm">Click to upload photos</p>
              <p className="text-gray-500 text-xs mt-1">Multiple selection allowed (max 5MB each)</p>
            </label>
          </div>

          {/* New Photos Preview */}
          {photosPreviews.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                New Photos Preview
              </label>
              <div className="grid grid-cols-2 gap-4">
                {photosPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-700/50 border border-violet-500">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeNewPhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Photos */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-6">Current Photos</h2>
        
        {currentPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPhotos.map((photo, index) => {
              const isMarkedForDeletion = deletedPhotos.some(deleted => 
                (deleted.publicId && deleted.publicId === photo.publicId) || 
                (deleted._id && deleted._id === photo._id) ||
                (deleted.url && deleted.url === photo.url)
              );
              
              return (
                <div key={index} className="relative group">
                  <div className={`aspect-video rounded-lg overflow-hidden bg-gray-700/50 border ${
                    isMarkedForDeletion ? 'border-red-500 opacity-50' : 'border-gray-600'
                  }`}>
                    <img
                      src={photo.url}
                      alt={photo.caption || `Gym photo ${index + 1}`}
                      className={`w-full h-full object-cover ${
                        isMarkedForDeletion ? 'grayscale' : ''
                      }`}
                    />
                    {isMarkedForDeletion && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Will be deleted
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (isMarkedForDeletion) {
                        // Remove from deleted photos (restore)
                        setDeletedPhotos(prev => prev.filter(deleted => 
                          !(deleted.publicId === photo.publicId || 
                            deleted._id === photo._id || 
                            deleted.url === photo.url)
                        ));
                      } else {
                        // Mark for deletion
                        removeCurrentPhoto(index);
                      }
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                      isMarkedForDeletion 
                        ? 'bg-green-500/80 text-white hover:bg-green-600/80' 
                        : 'bg-red-500/80 text-white hover:bg-red-600/80'
                    }`}
                    title={isMarkedForDeletion ? 'Restore photo' : 'Delete photo'}
                  >
                    {isMarkedForDeletion ? <FiX className="h-4 w-4" /> : <FiTrash2 className="h-4 w-4" />}
                  </button>
                  {photo.caption && (
                    <p className={`text-sm mt-2 truncate ${
                      isMarkedForDeletion ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {photo.caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiImage className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No photos uploaded yet</p>
            <p className="text-gray-500 text-sm">Upload some photos to showcase your gym</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageImages;