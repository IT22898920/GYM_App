import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiActivity,
  FiUser,
  FiCheck,
  FiX,
  FiTarget,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import api from "../utils/api";

function ViewMyWorkout() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Workout plans data - will be populated from backend
  const [workoutPlans, setWorkoutPlans] = useState([]);

  // Fetch workout plans from backend
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        const response = await api.getMyWorkoutPlans();
        
        if (response.success) {
          // Transform backend data to match UI structure
          const transformedPlans = response.data.map((plan) => {
            // Determine status based on dates
            const now = new Date();
            const startDate = new Date(plan.startDate);
            const endDate = new Date(plan.endDate);
            
            let planStatus = plan.status;
            if (planStatus === 'active') {
              if (now < startDate) planStatus = 'upcoming';
              else if (now > endDate) planStatus = 'completed';
            }

            // Calculate progress
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const daysPassed = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
            const progress = planStatus === 'completed' ? 100 : 
                           planStatus === 'upcoming' ? 0 : 
                           Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

            return {
              id: plan._id,
              name: plan.planName,
              instructor: {
                name: plan.instructor ? 
                  `${plan.instructor.firstName} ${plan.instructor.lastName}` : 
                  'Unknown Instructor',
                email: plan.instructor?.email || '',
              },
              startDate: plan.startDate,
              endDate: plan.endDate,
              type: plan.type,
              description: plan.description || 'No description provided',
              progress: progress,
              status: planStatus,
              schedule: plan.schedule?.map(scheduleItem => ({
                day: scheduleItem.days?.join(', ') || 'Unscheduled',
                exercises: scheduleItem.exercises || [],
                meals: scheduleItem.meals || [],
                supplements: scheduleItem.supplements || [],
              })) || [],
            };
          });

          setWorkoutPlans(transformedPlans);
        }
      } catch (err) {
        console.error('Error fetching workout plans:', err);
        setError(err.message || 'Failed to load workout plans');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchWorkoutPlans();
  }, []);

  const toggleExerciseCompletion = (planId, dayIndex, exerciseIndex) => {
    setWorkoutPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            schedule: plan.schedule.map((day, dIndex) => {
              if (dIndex === dayIndex) {
                return {
                  ...day,
                  exercises: day.exercises.map((exercise, eIndex) => {
                    if (eIndex === exerciseIndex) {
                      return {
                        ...exercise,
                        completed: !exercise.completed,
                      };
                    }
                    return exercise;
                  }),
                };
              }
              return day;
            }),
          };
        }
        return plan;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400";
      case "completed":
        return "bg-blue-500/10 text-blue-400";
      case "upcoming":
        return "bg-violet-500/10 text-violet-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const sortedWorkoutPlans = [...workoutPlans].sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  const getTimelinePosition = (plan) => {
    const now = new Date();
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);

    if (now < startDate) {
      return "future";
    } else if (now > endDate) {
      return "past";
    }
    return "present";
  };

  const getTimelineNodeStyle = (plan) => {
    const position = getTimelinePosition(plan);
    switch (position) {
      case "past":
        return "border-green-500 bg-green-500";
      case "present":
        return "border-violet-500 bg-violet-500 animate-pulse";
      case "future":
        return "border-gray-500 bg-gray-900";
      default:
        return "border-gray-500 bg-gray-900";
    }
  };

  const getTimelineLineStyle = (plan) => {
    const position = getTimelinePosition(plan);
    switch (position) {
      case "past":
        return "bg-green-500/50";
      case "present":
        return "bg-violet-500/50";
      case "future":
        return "bg-gray-700";
      default:
        return "bg-gray-700";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your workout plans...</p>
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
        {/* Back Button */}
        <Link
          to="/profile"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            My Workout Plans
          </h1>
          <p className="text-gray-400">
            Track your progress and view your workout plans
          </p>
        </div>

        {/* No Workout Plans Message */}
        {workoutPlans.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-12 border border-gray-700/50 text-center">
              <FiActivity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Workout Plans Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Your instructor hasn't assigned any workout plans to you yet. Check back later!
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to Profile
              </Link>
            </div>
          </div>
        ) : (
          /* Timeline View */
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px">
                {sortedWorkoutPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`absolute w-full ${getTimelineLineStyle(
                      plan
                    )} transition-all duration-300`}
                    style={{
                      top: `${(index / sortedWorkoutPlans.length) * 100}%`,
                      height: `${(1 / sortedWorkoutPlans.length) * 100}%`,
                    }}
                  ></div>
                ))}
              </div>

            <div className="space-y-8">
              {sortedWorkoutPlans.map((plan, index) => (
                <div key={plan.id} className="relative">
                  {/* Timeline Node */}
                  <div
                    className={`absolute left-8 -translate-x-1/2 top-8 w-4 h-4 rounded-full border-2 transition-all duration-300 ${getTimelineNodeStyle(
                      plan
                    )}`}
                  >
                    {/* Date Tooltip */}
                    <div className="absolute left-0 -translate-x-full -translate-y-1/2 mr-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">
                        {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Plan Card */}
                  <div className="ml-16">
                    <div
                      className={`bg-gray-800/40 backdrop-blur-xl rounded-xl border transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? "border-violet-500/50 shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                          : "border-gray-700/50"
                      } overflow-hidden`}
                    >
                      {/* Plan Header */}
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() =>
                          setSelectedPlan(
                            selectedPlan === plan.id ? null : plan.id
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-semibold text-white">
                            {plan.name}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                              plan.status
                            )}`}
                          >
                            {plan.status.charAt(0).toUpperCase() +
                              plan.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-400">
                              <FiUser className="w-4 h-4 mr-2 text-violet-400" />
                              <span>{plan.instructor.name}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <FiCalendar className="w-4 h-4 mr-2 text-violet-400" />
                              <span>
                                {new Date(plan.startDate).toLocaleDateString()}{" "}
                                - {new Date(plan.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <FiActivity className="w-4 h-4 mr-2 text-violet-400" />
                              <span>{plan.type}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-400 mb-2">Progress</div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-500 rounded-full"
                                  style={{ width: `${plan.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium">
                                {plan.progress}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-gray-400">{plan.description}</p>
                          {selectedPlan === plan.id ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Plan Details */}
                      {selectedPlan === plan.id && (
                        <div className="border-t border-gray-700/50 p-6">
                          <div className="space-y-6">
                            {plan.schedule.map((day, dayIndex) => (
                              <div key={dayIndex}>
                                <h3 className="text-lg font-medium text-white mb-4">
                                  {day.day}
                                </h3>
                                <div className="space-y-4">
                                  {day.exercises.map(
                                    (exercise, exerciseIndex) => (
                                      <div
                                        key={exerciseIndex}
                                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-medium text-white">
                                              {exercise.name}
                                            </h4>
                                            <button
                                              onClick={() =>
                                                toggleExerciseCompletion(
                                                  plan.id,
                                                  dayIndex,
                                                  exerciseIndex
                                                )
                                              }
                                              className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                                                exercise.completed
                                                  ? "bg-green-500/10 text-green-400"
                                                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                              } transition-colors`}
                                            >
                                              {exercise.completed ? (
                                                <>
                                                  <FiCheck className="w-4 h-4" />
                                                  <span>Completed</span>
                                                </>
                                              ) : (
                                                <>
                                                  <FiX className="w-4 h-4" />
                                                  <span>Mark Complete</span>
                                                </>
                                              )}
                                            </button>
                                          </div>
                                          <div className="flex items-center gap-6 text-gray-400">
                                            {exercise.sets && (
                                              <span>{exercise.sets} sets</span>
                                            )}
                                            {exercise.reps && (
                                              <span>{exercise.reps} reps</span>
                                            )}
                                            {exercise.weight && (
                                              <span>{exercise.weight}</span>
                                            )}
                                            {exercise.duration && (
                                              <span>{exercise.duration}</span>
                                            )}
                                            {exercise.intensity && (
                                              <span>
                                                Intensity: {exercise.intensity}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMyWorkout;
