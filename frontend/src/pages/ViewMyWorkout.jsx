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

  // GIF Modal states
  const [showGifModal, setShowGifModal] = useState(false);
  const [selectedExerciseGif, setSelectedExerciseGif] = useState(null);
  const [allGifs, setAllGifs] = useState([]);
  const [gifsLoading, setGifsLoading] = useState(false);

  // Confirmation Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exerciseToComplete, setExerciseToComplete] = useState(null);

  // Fetch workout plans from backend
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        const response = await api.getMyWorkoutPlans();
        
        // Display API response in console
        console.log('📋 My Workout Plans API Response:', response);
        console.log('📊 Workout Plans Data:', response.data);
        
        // Debug: Check if workoutStatus exists in exercises
        if (response.data && response.data.length > 0) {
          const firstPlan = response.data[0];
          console.log('🔍 First plan schedule:', firstPlan.schedule);
          if (firstPlan.schedule && firstPlan.schedule.length > 0) {
            const firstDay = firstPlan.schedule[0];
            console.log('🔍 First day exercises:', firstDay.exercises);
            if (firstDay.exercises && firstDay.exercises.length > 0) {
              console.log('🔍 First exercise:', firstDay.exercises[0]);
              console.log('🔍 First exercise workoutStatus:', firstDay.exercises[0].workoutStatus);
            }
          }
        }
        
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

            // Transform schedule data
            const transformedSchedule = plan.schedule?.map(scheduleItem => ({
              day: scheduleItem.days?.join(', ') || 'Unscheduled',
              exercises: scheduleItem.exercises?.map(exercise => ({
                ...exercise,
                workoutStatus: exercise.workoutStatus || 0 // Ensure workoutStatus exists
              })) || [],
              meals: scheduleItem.meals || [],
              supplements: scheduleItem.supplements || [],
            })) || [];

            // Calculate progress based on completed exercises (not time)
            let progress = 0;
            let totalExercises = 0;
            let completedExercises = 0;
            
            transformedSchedule.forEach((day) => {
              if (day.exercises && day.exercises.length > 0) {
                day.exercises.forEach((exercise) => {
                  totalExercises++;
                  if (exercise.workoutStatus === 1) {
                    completedExercises++;
                  }
                });
              }
            });
            
            if (totalExercises > 0) {
              progress = Math.round((completedExercises / totalExercises) * 100);
            }

            // Update status based on completion
            if (progress === 100) {
              planStatus = 'completed';
            } else if (progress > 0 && progress < 100) {
              planStatus = 'active';
            } else if (now < startDate) {
              planStatus = 'upcoming';
            }

            console.log(`📋 Plan "${plan.planName}": ${completedExercises}/${totalExercises} exercises completed = ${progress}%`);

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
              schedule: transformedSchedule,
            };
          });

          console.log('✨ Transformed Workout Plans:', transformedPlans);
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

  // Fetch all GIFs from backend
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        setGifsLoading(true);
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBase}/gifs`);
        const data = await response.json();
        
        if (data.success) {
          setAllGifs(data.data || []);
          console.log('🎬 Loaded GIFs:', data.data?.length);
        }
      } catch (err) {
        console.error('Error fetching GIFs:', err);
      } finally {
        setGifsLoading(false);
      }
    };

    fetchGifs();
  }, []);

  // Calculate progress based on completed exercises
  const calculateProgress = (schedule) => {
    if (!schedule || schedule.length === 0) return 0;
    
    let totalExercises = 0;
    let completedExercises = 0;
    
    schedule.forEach((day) => {
      if (day.exercises && day.exercises.length > 0) {
        day.exercises.forEach((exercise) => {
          totalExercises++;
          if (exercise.workoutStatus === 1) {
            completedExercises++;
          }
        });
      }
    });
    
    if (totalExercises === 0) return 0;
    
    // Calculate percentage: (completed / total) * 100
    const progressPercentage = Math.round((completedExercises / totalExercises) * 100);
    
    console.log(`📊 Progress Calculation: ${completedExercises}/${totalExercises} exercises = ${progressPercentage}%`);
    
    return progressPercentage;
  };

  // Handle exercise name click to show GIF
  const handleExerciseClick = (exerciseName) => {
    // Find matching GIF by name (case-insensitive)
    const matchingGif = allGifs.find(
      gif => gif.name.toLowerCase() === exerciseName.toLowerCase()
    );

    if (matchingGif) {
      setSelectedExerciseGif({
        name: matchingGif.name,
        url: matchingGif.url
      });
      setShowGifModal(true);
      console.log('🎬 Showing GIF for:', exerciseName);
    } else {
      console.log('⚠️ No GIF found for:', exerciseName);
      // Still show modal but with "no GIF available" message
      setSelectedExerciseGif({
        name: exerciseName,
        url: null
      });
      setShowGifModal(true);
    }
  };

  // Close GIF modal
  const closeGifModal = () => {
    setShowGifModal(false);
    setSelectedExerciseGif(null);
  };

  const handleMarkCompleteClick = (planId, dayIndex, exerciseIndex) => {
    // Find the current exercise status
    const currentPlan = workoutPlans.find(plan => plan.id === planId);
    if (!currentPlan) {
      console.error('Plan not found:', planId);
      return;
    }
    
    const currentExercise = currentPlan.schedule[dayIndex].exercises[exerciseIndex];
    if (!currentExercise) {
      console.error('Exercise not found:', { dayIndex, exerciseIndex });
      return;
    }
    
    // If already completed, don't allow toggling back
    if (currentExercise.workoutStatus === 1) {
      alert('This exercise is already completed and cannot be changed.');
      return;
    }
    
    // Store exercise details and show confirmation modal
    setExerciseToComplete({
      planId,
      dayIndex,
      exerciseIndex,
      exerciseName: currentExercise.name,
      planName: currentPlan.name
    });
    setShowConfirmModal(true);
  };

  const confirmExerciseCompletion = async () => {
    if (!exerciseToComplete) return;

    try {
      const { planId, dayIndex, exerciseIndex } = exerciseToComplete;
      const newExerciseStatus = 1; // Always set to completed
      
      console.log('Marking exercise as completed:', { planId, dayIndex, exerciseIndex, newExerciseStatus });

      // Call API to update workout status
      const response = await api.updateWorkoutStatus(planId, dayIndex, exerciseIndex, newExerciseStatus);
      
      if (response.success) {
        console.log('API response:', response);
        
        // Update local state with API response
        setWorkoutPlans((prev) =>
          prev.map((plan) => {
            if (plan.id === planId) {
              const updatedSchedule = plan.schedule.map((day, dIndex) => {
                if (dIndex === dayIndex) {
                  return {
                    ...day,
                    exercises: day.exercises.map((exercise, eIndex) => {
                      if (eIndex === exerciseIndex) {
                        return {
                          ...exercise,
                          workoutStatus: newExerciseStatus,
                        };
                      }
                      return exercise;
                    }),
                  };
                }
                return day;
              });

              // Update status based on API response
              let newPlanStatus = plan.status;
              if (response.data.progress === 100) {
                newPlanStatus = 'completed';
              } else if (response.data.progress > 0 && response.data.progress < 100) {
                newPlanStatus = 'active';
              }

              return {
                ...plan,
                schedule: updatedSchedule,
                progress: response.data.progress,
                status: newPlanStatus
              };
            }
            return plan;
          })
        );

        console.log(`✅ Exercise "${exerciseToComplete.exerciseName}" marked as completed`);
        alert(`Great job! "${exerciseToComplete.exerciseName}" has been marked as completed.`);
      } else {
        console.error('Failed to update workout status:', response.message);
        alert('Failed to update workout status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating workout status:', error);
      alert('Error updating workout status. Please try again.');
    } finally {
      // Close modal and reset state
      setShowConfirmModal(false);
      setExerciseToComplete(null);
    }
  };

  const cancelExerciseCompletion = () => {
    setShowConfirmModal(false);
    setExerciseToComplete(null);
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
                          {/* Completion Summary */}
                          <div className="mb-6 p-4 bg-violet-500/10 rounded-lg border border-violet-500/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-violet-400 mb-1">Exercise Completion</h4>
                                <p className="text-xs text-gray-400">
                                  Track your progress by marking exercises as complete
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                  {plan.schedule.reduce((total, day) => 
                                    total + day.exercises.filter(ex => ex.workoutStatus === 1).length, 0
                                  )}
                                  <span className="text-gray-400"> / </span>
                                  {plan.schedule.reduce((total, day) => 
                                    total + day.exercises.length, 0
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">exercises completed</div>
                              </div>
                            </div>
                          </div>

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
                                            <h4 
                                              className="text-lg font-medium text-white hover:text-violet-400 cursor-pointer transition-colors flex items-center gap-2 group"
                                              onClick={() => handleExerciseClick(exercise.name)}
                                              title="Click to view exercise demonstration"
                                            >
                                              {exercise.name}
                                              <span className="text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                🎬 View Demo
                                              </span>
                                            </h4>
                                            <button
                                              onClick={() => {
                                                console.log('Button clicked!', {
                                                  planId: plan.id,
                                                  dayIndex,
                                                  exerciseIndex,
                                                  exercise: exercise,
                                                  currentStatus: exercise.workoutStatus
                                                });
                                                handleMarkCompleteClick(
                                                  plan.id,
                                                  dayIndex,
                                                  exerciseIndex
                                                );
                                              }}
                                              disabled={exercise.workoutStatus === 1}
                                              className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                                                exercise.workoutStatus === 1
                                                  ? "bg-green-500/20 text-green-400 cursor-not-allowed opacity-75"
                                                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                                              } transition-colors`}
                                              title={exercise.workoutStatus === 1 ? "Exercise completed - cannot be changed" : "Click to mark as complete"}
                                            >
                                              {exercise.workoutStatus === 1 ? (
                                                <>
                                                  <FiCheck className="w-4 h-4" />
                                                  <span> Completed</span>
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

      {/* GIF Modal */}
      {showGifModal && selectedExerciseGif && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeGifModal}
        >
          <div 
            className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-violet-500/50 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎬</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedExerciseGif.name}
                  </h3>
                  <p className="text-violet-200 text-sm">Exercise Demonstration</p>
                </div>
              </div>
              <button
                onClick={closeGifModal}
                className="text-white hover:text-red-400 transition-colors text-3xl font-bold"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {gifsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500"></div>
                </div>
              ) : selectedExerciseGif.url ? (
                <div className="space-y-4">
                  {/* GIF Display */}
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    <img
                      src={selectedExerciseGif.url}
                      alt={selectedExerciseGif.name}
                      className="w-full h-auto max-h-[60vh] object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Instructions */}
                  {/* <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <h4 className="text-violet-400 font-semibold mb-3">How to perform:</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Watch the demonstration carefully</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Follow the exact movement pattern shown</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Keep proper form throughout the exercise</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Breathe correctly during each rep</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Start slowly and focus on technique</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-violet-400 mt-1">•</span>
                            <span>Stop if you feel any pain or discomfort</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎥</div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    No Demonstration Available
                  </h4>
                  <p className="text-gray-400">
                    GIF demonstration for "{selectedExerciseGif.name}" is not available yet.
                    <br />
                    Please consult your instructor for proper technique.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-900/50 p-4 flex justify-end gap-3">
              <button
                onClick={closeGifModal}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && exerciseToComplete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={cancelExerciseCompletion}
        >
          <div 
            className="bg-gray-800 rounded-2xl max-w-md w-full border-2 border-violet-500/50 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💪</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Mark Exercise Complete
                  </h3>
                  <p className="text-violet-200 text-sm">Confirm your workout completion</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏋️‍♂️</div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  "{exerciseToComplete.exerciseName}"
                </h4>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to mark this exercise as completed?
                </p>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="text-violet-200 text-sm">
                    <strong>⚠️ Important:</strong> This action cannot be undone. Once marked as completed, 
                    the exercise status cannot be changed back.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-900/50 p-6 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={cancelExerciseCompletion}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExerciseCompletion}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMyWorkout;
