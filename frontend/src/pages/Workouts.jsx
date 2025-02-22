import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiCheck,
  FiX,
  FiBarChart2,
  FiTrendingUp,
  FiHeart,
  FiTarget,
  FiMoreVertical,
  FiFilter,
  FiUser,
} from "react-icons/fi";

function Workouts() {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedFilter, setSelectedFilter] = useState("all");

  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek;
  }

  // Sample workout data
  const workoutPlans = [
    {
      id: 1,
      name: "Strength Building Program",
      instructor: "Mike Johnson",
      startDate: "2024-03-10",
      endDate: "2024-04-10",
      status: "active",
      progress: 65,
      days: [
        {
          day: "Monday",
          exercises: [
            {
              name: "Bench Press",
              sets: 4,
              reps: "8-10",
              weight: "135 lbs",
              completed: true,
            },
            {
              name: "Squats",
              sets: 4,
              reps: "8-10",
              weight: "185 lbs",
              completed: true,
            },
            {
              name: "Deadlifts",
              sets: 3,
              reps: "8-10",
              weight: "225 lbs",
              completed: false,
            },
          ],
        },
        {
          day: "Wednesday",
          exercises: [
            {
              name: "Pull-ups",
              sets: 3,
              reps: "8-10",
              weight: "Bodyweight",
              completed: false,
            },
            {
              name: "Rows",
              sets: 3,
              reps: "12",
              weight: "95 lbs",
              completed: false,
            },
          ],
        },
        {
          day: "Friday",
          exercises: [
            {
              name: "Shoulder Press",
              sets: 4,
              reps: "8-10",
              weight: "85 lbs",
              completed: false,
            },
            {
              name: "Leg Press",
              sets: 3,
              reps: "12-15",
              weight: "275 lbs",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "HIIT Cardio Program",
      instructor: "Sarah Chen",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      status: "active",
      progress: 45,
      days: [
        {
          day: "Tuesday",
          exercises: [
            {
              name: "Sprint Intervals",
              sets: 8,
              duration: "30 sec",
              rest: "30 sec",
              completed: false,
            },
            {
              name: "Burpees",
              sets: 4,
              reps: "15",
              completed: false,
            },
          ],
        },
        {
          day: "Thursday",
          exercises: [
            {
              name: "Jump Rope",
              duration: "15 min",
              completed: false,
            },
            {
              name: "Mountain Climbers",
              sets: 4,
              duration: "45 sec",
              completed: false,
            },
          ],
        },
      ],
    },
  ];

  const stats = [
    {
      title: "Active Plans",
      value: "2",
      icon: FiActivity,
      color: "violet",
      description: "Current programs",
    },
    {
      title: "Workouts Done",
      value: "12",
      icon: FiCheck,
      color: "emerald",
      description: "This month",
    },
    {
      title: "Total Time",
      value: "18h",
      icon: FiClock,
      color: "blue",
      description: "Training time",
    },
    {
      title: "Progress",
      value: "75%",
      icon: FiTrendingUp,
      color: "amber",
      description: "Average completion",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            My Workouts
          </h1>
          <p className="text-gray-400 mt-1">
            Track your workout plans and progress
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-500/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Programs</option>
              <option value="active">Active Programs</option>
              <option value="completed">Completed Programs</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 text-gray-400 rounded-lg hover:text-white transition-colors">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors">
              <FiCalendar className="w-4 h-4" />
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Workout Plans */}
      <div className="space-y-6">
        {workoutPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden"
          >
            {/* Plan Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex flex-wrap gap-4 items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-violet-400" />
                      {plan.instructor}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-violet-400" />
                      {plan.startDate} - {plan.endDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
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
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Workout Schedule */}
            <div className="divide-y divide-gray-700/50">
              {plan.days.map((day, dayIndex) => (
                <div key={dayIndex} className="p-6">
                  <h4 className="text-lg font-medium text-white mb-4">
                    {day.day}
                  </h4>
                  <div className="space-y-4">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              exercise.completed
                                ? "bg-green-500/10 text-green-400"
                                : "bg-gray-700/50 text-gray-400"
                            }`}
                          >
                            {exercise.completed ? (
                              <FiCheck className="w-5 h-5" />
                            ) : (
                              <FiActivity className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">
                              {exercise.name}
                            </h5>
                            <div className="text-sm text-gray-400">
                              {exercise.sets && `${exercise.sets} sets`}
                              {exercise.reps && ` × ${exercise.reps} reps`}
                              {exercise.weight && ` @ ${exercise.weight}`}
                              {exercise.duration && ` for ${exercise.duration}`}
                              {exercise.rest && ` / ${exercise.rest} rest`}
                            </div>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            exercise.completed
                              ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              : "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                          }`}
                        >
                          {exercise.completed ? "Completed" : "Mark Complete"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
