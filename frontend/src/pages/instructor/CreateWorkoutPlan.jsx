import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiActivity,
  FiUser,
  FiSave,
  FiX,
} from "react-icons/fi";

function CreateWorkoutPlan() {
  const [formData, setFormData] = useState({
    studentId: "",
    planName: "",
    startDate: "",
    endDate: "",
    type: "",
    description: "",
    schedule: [
      {
        day: "Monday",
        exercises: [
          {
            name: "",
            sets: "",
            reps: "",
            weight: "",
            duration: "",
            notes: "",
          },
        ],
      },
    ],
  });

  // Sample data
  const students = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com" },
  ];

  const planTypes = [
    "Strength Training",
    "Weight Loss",
    "Muscle Gain",
    "Cardio",
    "Flexibility",
    "HIIT",
    "Recovery",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          day: weekDays[prev.schedule.length % 7],
          exercises: [
            {
              name: "",
              sets: "",
              reps: "",
              weight: "",
              duration: "",
              notes: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDay = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, index) => index !== dayIndex),
    }));
  };

  const addExercise = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            exercises: [
              ...day.exercises,
              {
                name: "",
                sets: "",
                reps: "",
                weight: "",
                duration: "",
                notes: "",
              },
            ],
          };
        }
        return day;
      }),
    }));
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            exercises: day.exercises.filter((_, idx) => idx !== exerciseIndex),
          };
        }
        return day;
      }),
    }));
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            exercises: day.exercises.map((exercise, idx) => {
              if (idx === exerciseIndex) {
                return {
                  ...exercise,
                  [field]: value,
                };
              }
              return exercise;
            }),
          };
        }
        return day;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/instructor/workout-plans"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Create New Workout Plan
            </h1>
            <p className="text-gray-400 mt-1">
              Design a personalized workout plan for your student
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selection */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Select Student</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-gray-500" />
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Plan Name */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Plan Name</label>
              <div className="relative">
                <FiActivity className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                  placeholder="e.g., Strength Building Program"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Start Date */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Start Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="group">
              <label className="block text-gray-300 mb-2">End Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Plan Type */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Plan Type</label>
              <div className="relative">
                <FiActivity className="absolute left-4 top-3.5 text-gray-500" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  <option value="">Select plan type</option>
                  {planTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              placeholder="Describe the goals and focus of this workout plan..."
            ></textarea>
          </div>
        </div>

        {/* Workout Schedule */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Workout Schedule
            </h2>
            <button
              type="button"
              onClick={addDay}
              className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Day</span>
            </button>
          </div>

          <div className="space-y-6">
            {formData.schedule.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <select
                      value={day.day}
                      onChange={(e) => {
                        const newSchedule = [...formData.schedule];
                        newSchedule[dayIndex].day = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          schedule: newSchedule,
                        }));
                      }}
                      className="bg-gray-800/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                    >
                      {weekDays.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Exercise</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-800/50 rounded-lg relative group"
                    >
                      {/* Exercise Name */}
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) =>
                            handleExerciseChange(
                              dayIndex,
                              exerciseIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="Exercise name"
                        />
                      </div>

                      {/* Sets */}
                      <div>
                        <input
                          type="text"
                          value={exercise.sets}
                          onChange={(e) =>
                            handleExerciseChange(
                              dayIndex,
                              exerciseIndex,
                              "sets",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="Sets"
                        />
                      </div>

                      {/* Reps */}
                      <div>
                        <input
                          type="text"
                          value={exercise.reps}
                          onChange={(e) =>
                            handleExerciseChange(
                              dayIndex,
                              exerciseIndex,
                              "reps",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="Reps"
                        />
                      </div>

                      {/* Weight */}
                      <div>
                        <input
                          type="text"
                          value={exercise.weight}
                          onChange={(e) =>
                            handleExerciseChange(
                              dayIndex,
                              exerciseIndex,
                              "weight",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="Weight"
                        />
                      </div>

                      {/* Remove Exercise Button */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeExercise(dayIndex, exerciseIndex)
                          }
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/instructor/workout-plans"
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <FiSave className="w-5 h-5" />
            <span>Save Plan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateWorkoutPlan;
