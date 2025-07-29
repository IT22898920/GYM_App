import { useState, useEffect } from "react";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiUsers,
  FiActivity,
  FiClock,
  FiSend,
  FiEye,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiMessageSquare,
  FiCalendar
} from "react-icons/fi";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";

function GymRequests() {
  const [collabRequests, setCollabRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGymDetailsModal, setShowGymDetailsModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { showAlert } = useAlert();



  // Fetch collaboration requests (received from gyms)
  const fetchCollabRequests = async () => {
    try {
      console.log('🔄 Starting to fetch collaboration requests...');
      const response = await api.getInstructorCollaborationRequests();
      console.log('📨 Collaboration Requests API Response:', response);
      if (response.success) {
        console.log('📨 Setting collaboration requests:', response.data?.length, 'requests');
        console.log('📨 Requests data:', response.data);
        setCollabRequests(response.data);
      } else {
        console.log('❌ API response not successful:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching collaboration requests:', error);
      showAlert('Failed to fetch collaboration requests', 'error');
    }
  };

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCollabRequests();
      setLoading(false);
    };
    loadData();
  }, []);



  // Accept collaboration request
  const handleAcceptCollabRequest = async (requestId) => {
    try {
      const response = await api.respondToCollaborationRequest(requestId, 'accept', 'Thank you for the invitation! I\'m excited to work with your gym.');
      if (response.success) {
        showAlert('Collaboration request accepted successfully!', 'success');
        fetchCollabRequests();
      }
    } catch (error) {
      console.error('Error accepting collaboration request:', error);
      showAlert(error.message || 'Failed to accept request', 'error');
    }
  };

  // Reject collaboration request
  const handleRejectCollabRequest = async (requestId) => {
    try {
      const response = await api.respondToCollaborationRequest(requestId, 'reject', 'Thank you for considering me, but I\'m not available at this time.');
      if (response.success) {
        showAlert('Collaboration request rejected', 'success');
        fetchCollabRequests();
      }
    } catch (error) {
      console.error('Error rejecting collaboration request:', error);
      showAlert(error.message || 'Failed to reject request', 'error');
    }
  };


  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending' },
      approved: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Approved' },
      rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Rejected' },
      cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Collaboration Invitations
          </h1>
          <p className="text-gray-400 mt-1">
            Manage invitations from gym owners for collaboration opportunities
          </p>
        </div>
        
        <button
          onClick={() => {
            fetchCollabRequests();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* No tabs needed - just show requests directly */}

      {/* Collaboration Invitations Section */}
        <div className="space-y-6">
            <div className="space-y-6">
              {collabRequests.length === 0 ? (
                <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 text-center">
                  <FiMessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No invitations received yet</h3>
                  <p className="text-gray-400">
                    Gym owners will send you collaboration invitations when they're interested in working with you.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collabRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {request.gym?.gymName}
                          </h3>
                          <div className="flex items-center text-gray-400 mb-2">
                            <FiMapPin className="w-4 h-4 mr-2" />
                            {request.gym?.gymAddress}
                          </div>
                          <div className="flex items-center text-gray-400 mb-2">
                            <FiUsers className="w-4 h-4 mr-2" />
                            From: {request.fromGymOwner?.firstName} {request.fromGymOwner?.lastName}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <FiCalendar className="w-4 h-4 mr-2" />
                            Received on {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(request.status)}
                          <button
                            onClick={() => {
                              console.log('🔍 Selected Gym Data:', request.gym);
                              console.log('🔍 Address:', request.gym?.address);
                              console.log('🔍 Services:', request.gym?.services);
                              console.log('🔍 Amenities:', request.gym?.amenities);
                              console.log('🖼️ Logo:', request.gym?.logo);
                              console.log('📸 Images:', request.gym?.images);
                              setSelectedGym(request.gym);
                              setShowGymDetailsModal(true);
                            }}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors text-sm flex items-center gap-1"
                          >
                            <FiEye className="w-3 h-3" />
                            View Gym
                          </button>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptCollabRequest(request._id)}
                                className="px-3 py-1 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors text-sm flex items-center gap-1"
                              >
                                <FiCheck className="w-3 h-3" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectCollabRequest(request._id)}
                                className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors text-sm flex items-center gap-1"
                              >
                                <FiX className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
                        <h4 className="text-white font-medium mb-2">Invitation Message</h4>
                        <p className="text-gray-400">{request.message}</p>
                      </div>

                      {request.responseMessage && (
                        <div className="bg-gray-900/30 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">
                            Your Response
                          </h4>
                          <p className="text-gray-400">{request.responseMessage}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

      {/* Gym Details Modal */}
      {showGymDetailsModal && selectedGym && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {selectedGym.logo?.url && (
                    <img
                      src={selectedGym.logo.url}
                      alt={`${selectedGym.gymName} logo`}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-600"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-white">
                    {selectedGym.gymName}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowGymDetailsModal(false);
                    setSelectedGym(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Basic Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiMapPin className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-gray-300 font-medium">Address</p>
                          <p className="text-gray-400">
                            {selectedGym.address ? `${selectedGym.address.street}, ${selectedGym.address.city}, ${selectedGym.address.state}, ${selectedGym.address.zipCode}` : 'Address not available'}
                          </p>
                          {selectedGym.address?.country && (
                            <p className="text-gray-500 text-sm">{selectedGym.address.country}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiActivity className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-gray-300 font-medium">Status & Verification</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs ${selectedGym.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {selectedGym.status}
                            </span>
                            {selectedGym.verificationStatus && (
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                                {selectedGym.verificationStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiStar className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-gray-300 font-medium">Rating & Reviews</p>
                          <p className="text-gray-400">
                            {selectedGym.rating?.average && selectedGym.rating.average > 0 ? `${selectedGym.rating.average}/5.0` : 'No rating yet'}
                          </p>
                          {selectedGym.rating?.totalReviews && selectedGym.rating.totalReviews > 0 && (
                            <p className="text-gray-500 text-sm">{selectedGym.rating.totalReviews} reviews</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FiUsers className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-gray-300 font-medium">Capacity & Members</p>
                          <p className="text-gray-400">
                            {selectedGym.capacity ? `Max capacity: ${selectedGym.capacity} members` : 'Capacity not specified'}
                          </p>
                          {selectedGym.memberCount && selectedGym.memberCount > 0 && (
                            <p className="text-gray-500 text-sm">Current members: {selectedGym.memberCount}</p>
                          )}
                        </div>
                      </div>

                      {selectedGym.establishedYear && selectedGym.establishedYear > 0 && (
                        <div className="flex items-start">
                          <FiCalendar className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-gray-300 font-medium">Established</p>
                            <p className="text-gray-400">{selectedGym.establishedYear}</p>
                          </div>
                        </div>
                      )}

                      {selectedGym.contactInfo && (selectedGym.contactInfo.email || selectedGym.contactInfo.phone || (selectedGym.contactInfo.website && selectedGym.contactInfo.website.trim())) && (
                        <div className="flex items-start">
                          <FiMessageSquare className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-gray-300 font-medium">Contact Information</p>
                            <div className="space-y-1">
                              {selectedGym.contactInfo.email && (
                                <p className="text-gray-400 text-sm">📧 {selectedGym.contactInfo.email}</p>
                              )}
                              {selectedGym.contactInfo.phone && (
                                <p className="text-gray-400 text-sm">📞 {selectedGym.contactInfo.phone}</p>
                              )}
                              {selectedGym.contactInfo.website && selectedGym.contactInfo.website.trim() && (
                                <p className="text-gray-400 text-sm">🌐 {selectedGym.contactInfo.website}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGym.operatingHours && (
                        <div className="flex items-start">
                          <FiClock className="w-5 h-5 text-violet-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-gray-300 font-medium">Operating Hours</p>
                            <div className="space-y-1 mt-2">
                              {Object.entries(selectedGym.operatingHours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize w-20">{day}:</span>
                                  {hours.closed ? (
                                    <span className="text-red-400 text-sm">Closed</span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Open'}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedGym.description && selectedGym.description.trim() && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                      <p className="text-gray-400 leading-relaxed">
                        {selectedGym.description}
                      </p>
                    </div>
                  )}

                  {selectedGym.images && selectedGym.images.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Gym Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedGym.images.map((image, index) => (
                          <div key={index} className="relative group cursor-pointer" onClick={() => {
                            setSelectedImage(image);
                            setShowImageModal(true);
                          }}>
                            <img
                              src={image.url}
                              alt={image.caption || `Gym image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-600 group-hover:border-violet-400 transition-colors"
                            />
                            {image.isPrimary && (
                              <div className="absolute top-1 left-1 bg-violet-500 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg">
                                {image.caption}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <FiEye className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.facilities && selectedGym.facilities.length > 0 ? (
                        selectedGym.facilities.map((facility, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-sm"
                          >
                            {facility}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-sm">
                          No facilities listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.services && selectedGym.services.length > 0 ? (
                        selectedGym.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-sm">
                          No services listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.amenities && selectedGym.amenities.length > 0 ? (
                        selectedGym.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-sm">
                          No amenities listed
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedGym.specialPrograms && selectedGym.specialPrograms.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Special Programs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGym.specialPrograms.map((program, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGym.certifications && selectedGym.certifications.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGym.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGym.tags && selectedGym.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGym.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-500/10 text-gray-300 rounded-lg text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGym.pricing && selectedGym.pricing.membershipPlans && selectedGym.pricing.membershipPlans.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Pricing Plans</h4>
                      <div className="space-y-2">
                        {selectedGym.pricing.membershipPlans && selectedGym.pricing.membershipPlans.map((plan, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-300 font-medium">{plan.name}</span>
                              <span className="text-violet-400 font-semibold">${plan.price}/{plan.duration}</span>
                            </div>
                            {plan.benefits && plan.benefits.length > 0 && (
                              <div className="text-gray-400 text-sm">
                                Benefits: {plan.benefits.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                        {selectedGym.pricing.dropInFee !== undefined && (
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 font-medium">Drop-in Fee</span>
                              <span className="text-violet-400 font-semibold">${selectedGym.pricing.dropInFee}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setShowGymDetailsModal(false);
                    setSelectedGym(null);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-90"></div>
            </div>

            <div className="inline-block w-full max-w-4xl p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedImage.caption || 'Gym Image'}
                  </h3>
                  {selectedImage.isPrimary && (
                    <span className="inline-block mt-1 px-2 py-1 bg-violet-500 text-white text-xs rounded">
                      Primary Image
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setSelectedImage(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || 'Gym image'}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              {selectedImage.originalName && (
                <div className="mt-4 text-center text-gray-400 text-sm">
                  <p>Original: {selectedImage.originalName}</p>
                  {selectedImage.width && selectedImage.height && (
                    <p>Dimensions: {selectedImage.width} × {selectedImage.height}px</p>
                  )}
                  {selectedImage.size && (
                    <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setSelectedImage(null);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GymRequests;