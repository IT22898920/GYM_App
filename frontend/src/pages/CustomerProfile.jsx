import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiActivity,
  FiHeart,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiDollarSign,
  FiBarChart2,
  FiTarget,
  FiCheck,
  FiX,
  FiSun,
  FiSunrise,
  FiMessageCircle,
} from "react-icons/fi";
import api from "../utils/api";
import Chat from "../components/Chat";
import { useCall } from "../contexts/CallContext";
import { useAlert } from "../contexts/AlertContext";

function CustomerProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [collaborationId, setCollaborationId] = useState(null);
  const [assignedInstructor, setAssignedInstructor] = useState(null);

  const { initiateCall } = useCall();
  const { showAlert } = useAlert();

  // User data - will be populated from backend
  const [userData, setUserData] = useState(null);

  // Fetch customer profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.getMyProfile();
        
        if (response.success) {
          const member = response.data;
          
          // Store assigned instructor data for chat/call functionality
          if (member.assignedInstructor) {
            setAssignedInstructor(member.assignedInstructor);
          }

          // Transform backend data to match the UI structure
          const transformedData = {
            name: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phone: member.phoneNumber,
            address: member.address || 'Not provided',
            dateJoined: member.joinDate || member.createdAt,
            membershipPlan: member.membershipPlan?.name || 'Basic',
            membershipStatus: member.status === 'active' ? 'Active' : 
                             member.status === 'inactive' ? 'Inactive' : 'Suspended',
            nextPayment: member.paymentDetails?.nextPaymentDate || new Date(),
            gym: member.gym?.gymName || member.gym?.name || 'Not assigned',
            fitnessGoals: member.fitnessGoals || [],
            instructor: member.assignedInstructor ? 
              `${member.assignedInstructor.firstName} ${member.assignedInstructor.lastName}` : 'Not assigned',
            bodyMeasurements: {
              weight: member.bodyMeasurements?.weight || 0,
              height: member.bodyMeasurements?.height || 0,
              bmi: member.bodyMeasurements?.bmi || 0,
              bodyFat: member.bodyMeasurements?.bodyFat || 0,
              waist: member.bodyMeasurements?.waist || 0,
              hips: member.bodyMeasurements?.hips || 0,
              biceps: member.bodyMeasurements?.biceps || 0,
              thighs: member.bodyMeasurements?.thighs || 0,
            },
            progress: {
              workoutsCompleted: member.classesAttended || 0,
              hoursSpent: Math.round((member.classesAttended || 0) * 1.5), // Estimate 1.5 hours per class
              averageRating: 4.5, // Default rating
              attendance: member.attendance || 0,
              memberProgress: member.progress || 0,
            },
            upcomingClasses: [], // Placeholder - implement if you have classes feature
            classHistory: [], // Placeholder - implement if you have classes feature
          };
          
          setUserData(transformedData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  // Handle chat with assigned instructor
  const handleChatWithInstructor = async () => {
    if (!assignedInstructor) {
      showAlert('No instructor assigned to you', 'error');
      return;
    }

    try {
      // Create or get collaboration request for chat
      const response = await api.createMemberInstructorChat(assignedInstructor._id);
      console.log('Chat creation response:', response);
      
      if (response.success) {
        console.log('Collaboration data:', response.data);
        setCollaborationId(response.data._id);
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      showAlert('Failed to start chat with instructor', 'error');
    }
  };

  // Handle voice call with assigned instructor
  const handleVoiceCall = async () => {
    if (!assignedInstructor) {
      showAlert('No instructor assigned to you', 'error');
      return;
    }

    try {
      // First create/get collaboration and chat
      const collaborationResponse = await api.createMemberInstructorChat(assignedInstructor._id);
      if (!collaborationResponse.success) {
        throw new Error('Failed to create collaboration');
      }

      // Get the chat for this collaboration
      const chatResponse = await api.getOrCreateChat(collaborationResponse.data._id);
      if (!chatResponse.success) {
        throw new Error('Failed to get chat');
      }

      // Now initiate the call with the chat ID
      await initiateCall(chatResponse.data._id, 'voice', assignedInstructor);
    } catch (error) {
      console.error('Error initiating voice call:', error);
      showAlert('Failed to start voice call', 'error');
    }
  };


  // Close chat modal
  const closeChat = () => {
    setShowChat(false);
    setCollaborationId(null);
  };

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Personal Information
            </h3>
            <button
              onClick={handleEdit}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-gray-400">
              <FiUser className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.name}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiMail className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiPhone className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.phone}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiMapPin className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.address}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiCalendar className="w-5 h-5 mr-3 text-violet-400" />
              <span>
                Member since{" "}
                {new Date(userData.dateJoined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">
            Membership Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-400">
              <span>Plan</span>
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full">
                {userData.membershipPlan}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Status</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
                {userData.membershipStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Next Payment</span>
              <span>{new Date(userData.nextPayment).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Home Gym</span>
              <span>{userData.gym}</span>
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Fitness Goals</h3>
            <button
              onClick={handleEdit}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {userData.fitnessGoals && userData.fitnessGoals.length > 0 ? (
              userData.fitnessGoals.map((goal, index) => (
                <div key={index} className="flex items-center text-gray-400">
                  <FiTarget className="w-5 h-5 mr-3 text-violet-400" />
                  <span>{goal}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                No fitness goals set yet
              </div>
            )}
          </div>
        </div>

        {/* Assigned Instructor */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">
            Assigned Instructor
          </h3>
          <div className="space-y-4">
            <div className="flex items-center text-gray-400">
              <FiUser className="w-5 h-5 mr-3 text-violet-400" />
              <span>{userData.instructor || 'Not assigned yet'}</span>
            </div>
            
            {/* Chat and Call buttons - only show if instructor is assigned */}
            {assignedInstructor && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleChatWithInstructor}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={handleVoiceCall}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <FiPhone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiActivity className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress?.workoutsCompleted || 0}
                </span>
              </div>
              <span className="text-sm text-gray-400">Workouts Completed</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiClock className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress?.hoursSpent || 0}h
                </span>
              </div>
              <span className="text-sm text-gray-400">Hours Spent</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress?.attendance || 0}%
                </span>
              </div>
              <span className="text-sm text-gray-400">Attendance</span>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <FiTarget className="w-5 h-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">
                  {userData.progress?.memberProgress || 0}%
                </span>
              </div>
              <span className="text-sm text-gray-400">Goal Progress</span>
            </div>
          </div>
        </div>
      </div>
      {/* "View My Workout" Button */}
      <div className="mt-8 text-center">
        <Link
          to="/view-my-workout"
          className="px-6 py-3 bg-violet-500 hover:bg-violet-600 transition-colors rounded-full text-white font-semibold"
        >
          View My Workout
        </Link>
      </div>
    </>
  );

  const renderClasses = () => {
    if (!userData) return null;

    return (
      <div className="space-y-8">
        {/* Upcoming Classes */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">
            Upcoming Classes
          </h3>
          {userData.upcomingClasses && userData.upcomingClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {cls.name}
                      </h4>
                      <p className="text-gray-400 flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                        {cls.instructor}
                      </p>
                    </div>
                    <Link
                      to={`/book-class/${cls.id}`}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm hover:bg-violet-500/20 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                      {new Date(cls.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                      {cls.time}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                      {cls.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-12 border border-gray-700/50 text-center">
              <FiCalendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No upcoming classes scheduled</p>
            </div>
          )}
        </div>

        {/* Class History */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Class History</h3>
          {userData.classHistory && userData.classHistory.length > 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-4 text-gray-400 font-medium">
                      Class
                    </th>
                    <th className="text-left p-4 text-gray-400 font-medium">
                      Instructor
                    </th>
                    <th className="text-left p-4 text-gray-400 font-medium">
                      Date & Time
                    </th>
                    <th className="text-left p-4 text-gray-400 font-medium">
                      Location
                    </th>
                    <th className="text-left p-4 text-gray-400 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {userData.classHistory.map((cls) => (
                    <tr
                      key={cls.id}
                      className="hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-white">{cls.name}</span>
                      </td>
                      <td className="p-4 text-gray-400">{cls.instructor}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(cls.date).toLocaleDateString()} at {cls.time}
                      </td>
                      <td className="p-4 text-gray-400">{cls.location}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            cls.status === "Completed"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {cls.status === "Completed" ? (
                            <FiCheck className="w-4 h-4 mr-1" />
                          ) : (
                            <FiX className="w-4 h-4 mr-1" />
                          )}
                          {cls.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-12 border border-gray-700/50 text-center">
              <FiActivity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No class history available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    if (!userData) return null;

    const bodyStats = [
      {
        label: "Weight",
        current: userData.bodyMeasurements?.weight || 0,
        unit: "kg",
      },
      {
        label: "BMI",
        current: userData.bodyMeasurements?.bmi || 0,
        unit: "",
      },
      {
        label: "Body Fat",
        current: userData.bodyMeasurements?.bodyFat || 0,
        unit: "%",
      },
      {
        label: "Height",
        current: userData.bodyMeasurements?.height || 0,
        unit: "cm",
      },
      {
        label: "Waist",
        current: userData.bodyMeasurements?.waist || 0,
        unit: "cm",
      },
      {
        label: "Hips",
        current: userData.bodyMeasurements?.hips || 0,
        unit: "cm",
      },
    ];

    return (
      <div className="space-y-8">
        {/* Body Measurements */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Body Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bodyStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{stat.label}</h4>
                  <FiBarChart2 className="w-5 h-5 text-violet-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Current</span>
                    <span className="text-white font-semibold text-2xl">
                      {stat.current}
                      {stat.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Progress Overview</h3>
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-2">
                  {userData.progress?.workoutsCompleted || 0}
                </div>
                <div className="text-sm text-gray-400">Workouts Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-2">
                  {userData.progress?.attendance || 0}%
                </div>
                <div className="text-sm text-gray-400">Attendance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-2">
                  {userData.progress?.memberProgress || 0}%
                </div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-2">
                  {userData.progress?.hoursSpent || 0}h
                </div>
                <div className="text-sm text-gray-400">Hours Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900/50 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full animate-float"
              style={{
                width: Math.random() * 300 + 50 + "px",
                height: Math.random() * 300 + 50 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`container mx-auto px-4 relative transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Profile Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {userData.name}
              </h1>
              <p className="text-gray-400 mt-1">
                Member since{" "}
                {new Date(userData.dateJoined).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex space-x-6 border-b border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: FiUser },
              { id: "classes", label: "Classes", icon: FiCalendar },
              { id: "progress", label: "Progress", icon: FiActivity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "classes" && renderClasses()}
          {activeTab === "progress" && renderProgress()}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && collaborationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Chat with {assignedInstructor?.firstName} {assignedInstructor?.lastName}
              </h3>
              <button
                onClick={closeChat}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <Chat 
                collaborationId={collaborationId} 
                onClose={closeChat}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerProfile;
