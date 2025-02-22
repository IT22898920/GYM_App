import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiActivity,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiTarget,
  FiHeart,
  FiAward,
  FiBarChart2,
  FiCheck,
  FiX,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";

function ViewProgress() {
  const { studentId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Sample student data - replace with actual data fetch
  const student = {
    id: studentId,
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-02-15",
    activePlan: "Strength Building Program",
    progress: 65,
    attendance: 85,
    lastActive: "2024-03-05",
    status: "active",
    goals: [
      {
        id: 1,
        title: "Lose weight",
        target: "10 lbs",
        progress: 60,
        deadline: "2024-04-15",
        status: "in-progress",
      },
      {
        id: 2,
        title: "Build muscle",
        target: "Increase lean mass by 5 lbs",
        progress: 45,
        deadline: "2024-05-01",
        status: "in-progress",
      },
      {
        id: 3,
        title: "Improve flexibility",
        target: "Touch toes without bending knees",
        progress: 80,
        deadline: "2024-03-30",
        status: "completed",
      },
    ],
    metrics: {
      weight: {
        current: 180,
        target: 170,
        unit: "lbs",
        history: [
          { date: "2024-02-15", value: 185 },
          { date: "2024-02-22", value: 183 },
          { date: "2024-03-01", value: 181 },
          { date: "2024-03-08", value: 180 },
        ],
      },
      bodyFat: {
        current: 20,
        target: 15,
        unit: "%",
        history: [
          { date: "2024-02-15", value: 22 },
          { date: "2024-02-22", value: 21 },
          { date: "2024-03-01", value: 20.5 },
          { date: "2024-03-08", value: 20 },
        ],
      },
      strength: {
        current: 80,
        target: 100,
        unit: "kg",
        history: [
          { date: "2024-02-15", value: 75 },
          { date: "2024-02-22", value: 77 },
          { date: "2024-03-01", value: 78 },
          { date: "2024-03-08", value: 80 },
        ],
      },
    },
    workouts: [
      {
        date: "2024-03-08",
        type: "Strength Training",
        duration: 60,
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
        date: "2024-03-06",
        type: "Cardio",
        duration: 45,
        exercises: [
          {
            name: "Treadmill",
            duration: "30 min",
            intensity: "High",
            completed: true,
          },
          {
            name: "Jump Rope",
            duration: "15 min",
            intensity: "Medium",
            completed: true,
          },
        ],
      },
    ],
    achievements: [
      {
        title: "First Month Complete",
        description: "Completed one month of consistent training",
        date: "2024-03-15",
        icon: FiAward,
      },
      {
        title: "Weight Loss Milestone",
        description: "Lost first 5 pounds",
        date: "2024-03-01",
        icon: FiTarget,
      },
    ],
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <FiActivity className="w-6 h-6 text-violet-400" />
            <span className="text-2xl font-bold text-white">
              {student.progress}%
            </span>
          </div>
          <p className="text-gray-400">Overall Progress</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <FiCalendar className="w-6 h-6 text-violet-400" />
            <span className="text-2xl font-bold text-white">
              {student.attendance}%
            </span>
          </div>
          <p className="text-gray-400">Attendance Rate</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <FiClock className="w-6 h-6 text-violet-400" />
            <span className="text-2xl font-bold text-white">45h</span>
          </div>
          <p className="text-gray-400">Total Training</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <FiHeart className="w-6 h-6 text-violet-400" />
            <span className="text-2xl font-bold text-white">4.8</span>
          </div>
          <p className="text-gray-400">Avg. Intensity</p>
        </div>
      </div>

      {/* Current Goals */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Current Goals</h3>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {student.goals.map((goal) => (
            <div key={goal.id} className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiTarget className="w-4 h-4 text-violet-400 mr-2" />
                  <span className="text-white">{goal.title}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    goal.status === "completed"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-violet-500/10 text-violet-400"
                  }`}
                >
                  {goal.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Target: {goal.target}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-gray-400">{goal.progress}%</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-sm">
                  Due {new Date(goal.deadline).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-400 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">
          Recent Workouts
        </h3>
        <div className="space-y-4">
          {student.workouts.map((workout, index) => (
            <div key={index} className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-medium">{workout.type}</h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(workout.date).toLocaleDateString()} •{" "}
                    {workout.duration} min
                  </p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {workout.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      {exercise.completed ? (
                        <FiCheck className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-400 mr-2" />
                      )}
                      <span className="text-gray-300">{exercise.name}</span>
                    </div>
                    <span className="text-gray-400">
                      {exercise.sets && `${exercise.sets} × ${exercise.reps}`}
                      {exercise.weight && ` @ ${exercise.weight}`}
                      {exercise.duration && `${exercise.duration}`}
                      {exercise.intensity && ` (${exercise.intensity})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Achievements</h3>
        <div className="space-y-4">
          {student.achievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="p-3 bg-violet-500/10 rounded-lg">
                <achievement.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">{achievement.title}</h4>
                <p className="text-gray-400 text-sm">
                  {achievement.description}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Fitness Metrics</h3>
        <button
          onClick={() => setShowAddMetricModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Metric</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(student.metrics).map(([key, metric]) => (
          <div
            key={key}
            className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white capitalize">
                {key}
              </h4>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current</span>
                <span className="text-white font-medium">
                  {metric.current}
                  {metric.unit}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Target</span>
                <span className="text-violet-400 font-medium">
                  {metric.target}
                  {metric.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{
                    width: `${(metric.current / metric.target) * 100}%`,
                  }}
                ></div>
              </div>

              {/* History Chart */}
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-400 mb-4">
                  History
                </h5>
                <div className="relative h-32">
                  <div className="absolute inset-0 flex items-end justify-between">
                    {metric.history.map((point, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center group"
                        style={{
                          height: `${(point.value / metric.target) * 100}%`,
                        }}
                      >
                        <div className="relative">
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {point.value}
                            {metric.unit}
                          </div>
                          <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                        </div>
                        <div className="h-full w-0.5 bg-violet-500/20"></div>
                        <span className="text-xs text-gray-500 mt-2">
                          {new Date(point.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/instructor/students"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {student.name}'s Progress
            </h1>
            <p className="text-gray-400 mt-1">
              Track and manage student progress
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-700">
        {[
          { id: "overview", label: "Overview", icon: FiActivity },
          { id: "metrics", label: "Metrics", icon: FiBarChart2 },
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

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "metrics" && renderMetrics()}
    </div>
  );
}

export default ViewProgress;
