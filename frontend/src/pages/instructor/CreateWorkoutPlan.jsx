import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiActivity,
  FiUser,
  FiSave,
  FiX,
  FiCoffee,
  FiPackage,
} from "react-icons/fi";

function CreateWorkoutPlan() {
  const [formData, setFormData] = useState({
    studentId: "",
    planName: "",
    startDate: "",
    endDate: "",
    type: "",
    description: "",
    // The schedule array, each element supports multiple days via "days: []"
    schedule: [
      {
        days: [], // Store multiple selected days, e.g. ["Monday", "Wednesday"]
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
        meals: [
          {
            type: "Breakfast",
            time: "08:00",
            items: [],
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
            notes: "",
          },
        ],
        supplements: [
          {
            name: "",
            dosage: "",
            timing: "",
            notes: "",
          },
        ],
      },
    ],
  });

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gymExercises, setGymExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Fetch assigned members and gym exercises on component mount
  useEffect(() => {
    fetchAssignedMembers();
    fetchGymExercises();
  }, []);

  const fetchAssignedMembers = async () => {
    try {
      setLoadingStudents(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/instructors/assigned-members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned members');
      }

      const data = await response.json();
      // Transform the data to match the expected format
      const transformedStudents = data.data.map(member => ({
        id: member._id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        isFreelance: member.isFreelance || false,
        memberData: member
      }));
      setStudents(transformedStudents);
    } catch (error) {
      console.error('Error fetching assigned members:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchGymExercises = async () => {
    try {
      setLoadingExercises(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/instructors/gym-exercises`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gym exercises');
      }

      const data = await response.json();
      setGymExercises(data.data.exercises || []);
    } catch (error) {
      console.error('Error fetching gym exercises:', error);
      // Don't show error to user, just set empty array
      setGymExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  };

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

  const mealTypes = [
    "Breakfast",
    "Morning Snack",
    "Lunch",
    "Afternoon Snack",
    "Dinner",
    "Pre-Workout",
    "Post-Workout",
  ];

  const commonSupplements = [
    "Whey Protein",
    "Creatine Monohydrate",
    "BCAAs",
    "Pre-Workout",
    "Multivitamin",
    "Fish Oil",
    "Vitamin D",
  ];

  // ----- Basic input change handler -----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----- Schedule Day handlers -----
  // Add a new schedule block (with empty days, exercises, meals, supplements)
  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          days: [],
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
          meals: [
            {
              type: "Breakfast",
              time: "08:00",
              items: [],
              calories: "",
              protein: "",
              carbs: "",
              fats: "",
              notes: "",
            },
          ],
          supplements: [
            {
              name: "",
              dosage: "",
              timing: "",
              notes: "",
            },
          ],
        },
      ],
    }));
  };

  // Remove an entire schedule block
  const removeDayBlock = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, idx) => idx !== blockIndex),
    }));
  };

  // Toggle a specific weekday checkbox for a schedule block
  const handleDaysCheckbox = (blockIndex, dayName) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          const isSelected = block.days.includes(dayName);
          const updatedDays = isSelected
            ? block.days.filter((d) => d !== dayName)
            : [...block.days, dayName];
          return { ...block, days: updatedDays };
        }
        return block;
      }),
    }));
  };

  // ----- Exercise handlers -----
  const addExercise = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            exercises: [
              ...block.exercises,
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
        return block;
      }),
    }));
  };

  const removeExercise = (blockIndex, exerciseIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            exercises: block.exercises.filter((_, i) => i !== exerciseIndex),
          };
        }
        return block;
      }),
    }));
  };

  const handleExerciseChange = (blockIndex, exerciseIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            exercises: block.exercises.map((exercise, i) => {
              if (i === exerciseIndex) {
                return { ...exercise, [field]: value };
              }
              return exercise;
            }),
          };
        }
        return block;
      }),
    }));
  };

  // ----- Meal handlers -----
  const addMeal = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            meals: [
              ...block.meals,
              {
                type: "Breakfast",
                time: "08:00",
                items: [],
                calories: "",
                protein: "",
                carbs: "",
                fats: "",
                notes: "",
              },
            ],
          };
        }
        return block;
      }),
    }));
  };

  const removeMeal = (blockIndex, mealIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            meals: block.meals.filter((_, i) => i !== mealIndex),
          };
        }
        return block;
      }),
    }));
  };

  const handleMealChange = (blockIndex, mealIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            meals: block.meals.map((meal, i) => {
              if (i === mealIndex) {
                return { ...meal, [field]: value };
              }
              return meal;
            }),
          };
        }
        return block;
      }),
    }));
  };

  // ----- Supplement handlers -----
  const addSupplement = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            supplements: [
              ...block.supplements,
              { name: "", dosage: "", timing: "", notes: "" },
            ],
          };
        }
        return block;
      }),
    }));
  };

  const removeSupplement = (blockIndex, supplementIndex) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            supplements: block.supplements.filter(
              (_, i) => i !== supplementIndex
            ),
          };
        }
        return block;
      }),
    }));
  };

  const handleSupplementChange = (
    blockIndex,
    supplementIndex,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((block, idx) => {
        if (idx === blockIndex) {
          return {
            ...block,
            supplements: block.supplements.map((supplement, i) => {
              if (i === supplementIndex) {
                return { ...supplement, [field]: value };
              }
              return supplement;
            }),
          };
        }
        return block;
      }),
    }));
  };

  // ----- Form submission -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    if (submitting) return; // Prevent multiple submissions
    
    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/instructors/workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create workout plan');
      }

      console.log('Workout plan created successfully:', result);
      alert('Workout plan created successfully!');
      
      // Optional: redirect or reset form
      setFormData({
        studentId: "",
        planName: "",
        startDate: "",
        endDate: "",
        type: "",
        description: "",
        schedule: [{
          days: [],
          exercises: [
            { name: "", sets: "", reps: "", weight: "", duration: "", notes: "" }
          ],
          meals: [
            { type: "Breakfast", time: "08:00", items: [], calories: "", protein: "", carbs: "", fats: "", notes: "" }
          ],
          supplements: [
            { name: "", dosage: "", timing: "", notes: "" }
          ]
        }]
      });

    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert('Error creating workout plan: ' + error.message);
    } finally {
      setSubmitting(false);
    }
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
              Design a comprehensive fitness plan including workouts, meals, and
              supplements
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
                  disabled={loadingStudents || students.length === 0}
                  className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingStudents ? "Loading assigned members..." : students.length === 0 ? "No assigned members found" : "Select a student"}
                  </option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.isFreelance ? "Freelancing" : "Not Freelancing"})
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
                  placeholder="e.g., Complete Transformation Program"
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
              placeholder="Describe the goals and focus of this comprehensive fitness plan..."
            ></textarea>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Daily Schedule</h2>
            <button
              type="button"
              onClick={addDay}
              className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Day Block</span>
            </button>
          </div>

          {/* Render each schedule block */}
          <div className="space-y-8">
            {formData.schedule.map((block, blockIndex) => (
              <div
                key={blockIndex}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50"
              >
                {/* Days Selection (Multiple) */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Select Days
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeDayBlock(blockIndex)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {weekDays.map((dayName) => {
                    const isChecked = block.days.includes(dayName);
                    return (
                      <label
                        key={dayName}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleDaysCheckbox(blockIndex, dayName)
                          }
                          className="hidden"
                        />
                        <span
                          className={
                            isChecked
                              ? "text-violet-400 font-semibold"
                              : "text-gray-300"
                          }
                        >
                          {dayName}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Workouts Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-white">Workouts</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Exercises are loaded from your gym's available workouts
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addExercise(blockIndex)}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Exercise</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {block.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-800/50 rounded-lg relative group"
                      >
                        {/* Exercise Name */}
                        <div className="md:col-span-2">
                          <select
                            value={exercise.name}
                            onChange={(e) =>
                              handleExerciseChange(
                                blockIndex,
                                exerciseIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                            disabled={loadingExercises}
                          >
                            <option value="">
                              {loadingExercises ? "Loading exercises..." : 
                               gymExercises.length === 0 ? "No exercises available" : 
                               "Select exercise"}
                            </option>
                            {gymExercises.map((exerciseOption) => (
                              <option key={exerciseOption.id} value={exerciseOption.name}>
                                {exerciseOption.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Sets */}
                        <div>
                          <input
                            type="text"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(
                                blockIndex,
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
                                blockIndex,
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
                                blockIndex,
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
                              removeExercise(blockIndex, exerciseIndex)
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

                {/* Meals Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">Meals</h4>
                    <button
                      type="button"
                      onClick={() => addMeal(blockIndex)}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                    >
                      <FiCoffee className="w-4 h-4" />
                      <span>Add Meal</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {block.meals.map((meal, mealIndex) => (
                      <div
                        key={mealIndex}
                        className="bg-gray-800/50 rounded-lg p-4 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Meal Type */}
                          <div>
                            <select
                              value={meal.type}
                              onChange={(e) =>
                                handleMealChange(
                                  blockIndex,
                                  mealIndex,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                            >
                              {mealTypes.map((typeOption) => (
                                <option key={typeOption} value={typeOption}>
                                  {typeOption}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Meal Time */}
                          <div>
                            <input
                              type="time"
                              value={meal.time}
                              onChange={(e) =>
                                handleMealChange(
                                  blockIndex,
                                  mealIndex,
                                  "time",
                                  e.target.value
                                )
                              }
                              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                            />
                          </div>

                          {/* Calories */}
                          <div>
                            <input
                              type="number"
                              value={meal.calories}
                              onChange={(e) =>
                                handleMealChange(
                                  blockIndex,
                                  mealIndex,
                                  "calories",
                                  e.target.value
                                )
                              }
                              placeholder="Calories"
                              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                            />
                          </div>

                          {/* Remove Meal Button */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeMeal(blockIndex, mealIndex)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Macronutrients */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="number"
                            value={meal.protein}
                            onChange={(e) =>
                              handleMealChange(
                                blockIndex,
                                mealIndex,
                                "protein",
                                e.target.value
                              )
                            }
                            placeholder="Protein (g)"
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          />
                          <input
                            type="number"
                            value={meal.carbs}
                            onChange={(e) =>
                              handleMealChange(
                                blockIndex,
                                mealIndex,
                                "carbs",
                                e.target.value
                              )
                            }
                            placeholder="Carbs (g)"
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          />
                          <input
                            type="number"
                            value={meal.fats}
                            onChange={(e) =>
                              handleMealChange(
                                blockIndex,
                                mealIndex,
                                "fats",
                                e.target.value
                              )
                            }
                            placeholder="Fats (g)"
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          />
                        </div>

                        {/* Additional Notes / Food Items */}
                        <textarea
                          value={meal.notes}
                          onChange={(e) =>
                            handleMealChange(
                              blockIndex,
                              mealIndex,
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="List food items and notes..."
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          rows="2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supplements Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">
                      Supplements
                    </h4>
                    <button
                      type="button"
                      onClick={() => addSupplement(blockIndex)}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors"
                    >
                      <FiPackage className="w-4 h-4" />
                      <span>Add Supplement</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {block.supplements.map((supplement, supplementIndex) => (
                      <div
                        key={supplementIndex}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg"
                      >
                        {/* Supplement Name */}
                        <div>
                          <select
                            value={supplement.name}
                            onChange={(e) =>
                              handleSupplementChange(
                                blockIndex,
                                supplementIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          >
                            <option value="">Select Supplement</option>
                            {commonSupplements.map((suppName) => (
                              <option key={suppName} value={suppName}>
                                {suppName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Dosage */}
                        <div>
                          <input
                            type="text"
                            value={supplement.dosage}
                            onChange={(e) =>
                              handleSupplementChange(
                                blockIndex,
                                supplementIndex,
                                "dosage",
                                e.target.value
                              )
                            }
                            placeholder="Dosage (e.g., 5g, 1 capsule)"
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          />
                        </div>

                        {/* Timing */}
                        <div>
                          <input
                            type="time"
                            value={supplement.timing}
                            onChange={(e) =>
                              handleSupplementChange(
                                blockIndex,
                                supplementIndex,
                                "timing",
                                e.target.value
                              )
                            }
                            className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          />
                        </div>

                        {/* Remove Supplement Button */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              removeSupplement(blockIndex, supplementIndex)
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
            disabled={submitting}
            className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-5 h-5" />
            <span>{submitting ? 'Saving...' : 'Save Plan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateWorkoutPlan;
