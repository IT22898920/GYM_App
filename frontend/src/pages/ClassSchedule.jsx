import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUser,
  FiMapPin,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiActivity,
  FiCheck,
} from "react-icons/fi";

function ClassSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGym, setSelectedGym] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample data - replace with actual data from your backend
  const gyms = [
    { id: 1, name: "FitZone Elite", location: "Downtown" },
    { id: 2, name: "PowerFlex Gym", location: "Uptown" },
    { id: 3, name: "Wellness Hub", location: "West Side" },
  ];

  const instructors = [
    { id: 1, name: "Sarah Johnson", specialization: "Yoga" },
    { id: 2, name: "Mike Chen", specialization: "HIIT" },
    { id: 3, name: "Emma Rodriguez", specialization: "Strength Training" },
  ];

  const classTypes = [
    "All Classes",
    "Yoga",
    "HIIT",
    "Strength Training",
    "Pilates",
    "Spinning",
    "CrossFit",
  ];

  const classes = [
    {
      id: 1,
      name: "Morning Yoga Flow",
      instructor: "Sarah Johnson",
      gym: "FitZone Elite",
      time: "07:00 AM",
      duration: "60 min",
      price: 25,
      spots: 8,
      maxSpots: 12,
      type: "Yoga",
      level: "Intermediate",
    },
    {
      id: 2,
      name: "HIIT Blast",
      instructor: "Mike Chen",
      gym: "PowerFlex Gym",
      time: "08:30 AM",
      duration: "45 min",
      price: 30,
      spots: 5,
      maxSpots: 15,
      type: "HIIT",
      level: "Advanced",
    },
    {
      id: 3,
      name: "Strength Foundations",
      instructor: "Emma Rodriguez",
      gym: "Wellness Hub",
      time: "10:00 AM",
      duration: "50 min",
      price: 28,
      spots: 10,
      maxSpots: 10,
      type: "Strength Training",
      level: "Beginner",
    },
    {
      id: 4,
      name: "Evening Flow",
      instructor: "Sarah Johnson",
      gym: "FitZone Elite",
      time: "06:00 PM",
      duration: "60 min",
      price: 25,
      spots: 6,
      maxSpots: 12,
      type: "Yoga",
      level: "All Levels",
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay();

    // Add padding for previous month
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -startPadding + i + 1);
      days.push({ date: prevDate, isPadding: true });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isPadding: false });
    }

    // Add padding for next month if needed
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isPadding: true });
    }

    return days;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const nextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const filteredClasses = classes.filter((cls) => {
    if (selectedGym && cls.gym !== selectedGym) return false;
    if (selectedInstructor && cls.instructor !== selectedInstructor)
      return false;
    if (
      selectedClassType &&
      selectedClassType !== "All Classes" &&
      cls.type !== selectedClassType
    )
      return false;
    return true;
  });

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
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Class Schedule
          </h1>
          <p className="text-xl text-gray-400">
            Browse and book fitness classes that match your schedule
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Gym Filter */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Gym Location</label>
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">All Gyms</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.name}>
                    {gym.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructor Filter */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Instructor</label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                <option value="">All Instructors</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.name}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Type Filter */}
            <div className="group">
              <label className="block text-gray-300 mb-2">Class Type</label>
              <select
                value={selectedClassType}
                onChange={(e) => setSelectedClassType(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              >
                {classTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedGym("");
                  setSelectedInstructor("");
                  setSelectedClassType("");
                }}
                className="w-full px-6 py-3 text-gray-400 hover:text-white bg-gray-900/50 rounded-lg border border-gray-700 hover:border-violet-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiFilter className="w-5 h-5" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(selectedDate)}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-700/50 rounded-lg overflow-hidden">
            {/* Week days header */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-gray-800/80 p-4 text-center text-gray-400 font-medium"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDaysInMonth(selectedDate).map((day, index) => (
              <button
                key={index}
                onClick={() => !day.isPadding && setSelectedDate(day.date)}
                className={`relative bg-gray-800/80 min-h-[120px] p-4 transition-all duration-300 ${
                  day.isPadding
                    ? "text-gray-600 cursor-not-allowed"
                    : isToday(day.date)
                    ? "bg-violet-500/10"
                    : isSameDay(day.date, selectedDate)
                    ? "bg-violet-500/20"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    day.isPadding
                      ? "text-gray-600"
                      : isToday(day.date)
                      ? "text-violet-400"
                      : isSameDay(day.date, selectedDate)
                      ? "text-violet-400"
                      : "text-gray-300"
                  }`}
                >
                  {day.date.getDate()}
                </span>

                {/* Classes indicator */}
                {!day.isPadding && classes.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex gap-1">
                      {[...Array(Math.min(3, classes.length))].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full bg-violet-500/50"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <FiCalendar className="w-6 h-6 text-violet-400" />
            Classes for {formatDate(selectedDate)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="group bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {cls.name}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-violet-400" />
                      {cls.instructor}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                    {cls.type}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                    {cls.time} • {cls.duration}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                    {cls.gym}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiActivity className="w-4 h-4 mr-2 text-violet-400" />
                    {cls.level}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-400">
                    <span className="text-2xl font-bold text-white">
                      ${cls.price}
                    </span>{" "}
                    per class
                  </div>
                  <div className="text-gray-400 text-sm">
                    {cls.spots}/{cls.maxSpots} spots left
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                    <div
                      style={{ width: `${(cls.spots / cls.maxSpots) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500"
                    ></div>
                  </div>
                </div>

                <Link
                  to={`/book-class/${cls.id}`}
                  className="mt-6 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 flex items-center">
                    Book Now
                    {cls.spots === 0 ? (
                      <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        Full
                      </span>
                    ) : cls.spots <= 3 ? (
                      <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                        Few spots left
                      </span>
                    ) : null}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
                <FiCalendar className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Classes Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your filters or selecting a different date
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassSchedule;
