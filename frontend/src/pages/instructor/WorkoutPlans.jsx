import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUser,
  FiActivity,
  FiClock,
  FiTrash2,
  FiEdit2,
  FiMoreVertical,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function WorkoutPlans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sample data
  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      activePlan: "Strength Building Program",
      progress: 65,
      lastActive: "2024-03-05",
      status: "active",
      workoutPlans: [
        {
          id: 1,
          name: "Strength Building Program",
          startDate: "2024-03-01",
          endDate: "2024-04-01",
          type: "Strength",
          status: "active",
          progress: 65,
          schedule: [
            {
              day: "Monday",
              exercises: [
                {
                  name: "Bench Press",
                  sets: 4,
                  reps: "8-10",
                  weight: "135 lbs",
                },
                {
                  name: "Squats",
                  sets: 4,
                  reps: "8-10",
                  weight: "185 lbs",
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
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      activePlan: "Weight Loss Program",
      progress: 45,
      lastActive: "2024-03-06",
      status: "active",
      workoutPlans: [
        {
          id: 2,
          name: "Weight Loss Program",
          startDate: "2024-03-05",
          endDate: "2024-04-05",
          type: "Cardio",
          status: "active",
          progress: 45,
          schedule: [
            {
              day: "Tuesday",
              exercises: [
                {
                  name: "Treadmill",
                  duration: "30 min",
                  intensity: "High",
                },
              ],
            },
            {
              day: "Thursday",
              exercises: [
                {
                  name: "Circuit Training",
                  sets: 3,
                  duration: "45 min",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const stats = [
    {
      title: "Total Students",
      value: "24",
      change: "+12.5%",
      trend: "up",
      description: "Active students",
    },
    {
      title: "Active Plans",
      value: "18",
      change: "+23.4%",
      trend: "up",
      description: "Current plans",
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "+5.2%",
      trend: "up",
      description: "Average completion",
    },
    {
      title: "Student Progress",
      value: "78%",
      change: "+18.7%",
      trend: "up",
      description: "Average progress",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Workout Plans
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your students' workout plans
          </p>
        </div>
        <Link
          to="/instructor/workout-plans/create" // Navigate to CreateWorkoutPlan.jsx page
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create New Plan
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search students or plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="all">All Plans</option>
              <option value="active">Active Plans</option>
              <option value="completed">Completed Plans</option>
              <option value="draft">Draft Plans</option>
            </select>
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

      {/* Students List */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">
                  Student
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Active Plan
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Progress
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Last Active
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{student.activePlan}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{student.lastActive}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        student.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {student.status === "active" ? (
                        <FiCheck className="w-4 h-4 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 mr-1" />
                      )}
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="View Plans"
                      >
                        <FiActivity className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="More"
                      >
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Workout Plan Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedStudent.name}'s Workout Plans
                  </h3>
                  <p className="text-gray-400 mt-1">{selectedStudent.email}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="bg-gray-800 px-6 py-4">
                {selectedStudent.workoutPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {plan.name}
                        </h4>
                        <div className="flex items-center gap-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-violet-400" />
                            {plan.startDate} - {plan.endDate}
                          </div>
                          <div className="flex items-center gap-2">
                            <FiActivity className="w-4 h-4 text-violet-400" />
                            {plan.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">
                            Progress
                          </div>
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

                    {/* Schedule */}
                    <div className="space-y-6">
                      {plan.schedule.map((day, dayIndex) => (
                        <div key={dayIndex}>
                          <h5 className="text-lg font-medium text-white mb-4">
                            {day.day}
                          </h5>
                          <div className="space-y-4">
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exerciseIndex}
                                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                              >
                                <div>
                                  <h6 className="text-white font-medium mb-1">
                                    {exercise.name}
                                  </h6>
                                  <div className="text-sm text-gray-400">
                                    {exercise.sets && `${exercise.sets} sets`}
                                    {exercise.reps &&
                                      ` × ${exercise.reps} reps`}
                                    {exercise.weight && ` @ ${exercise.weight}`}
                                    {exercise.duration &&
                                      ` for ${exercise.duration}`}
                                    {exercise.intensity &&
                                      ` (${exercise.intensity} intensity)`}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <FiEdit2 className="w-5 h-5" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

export default WorkoutPlans;
