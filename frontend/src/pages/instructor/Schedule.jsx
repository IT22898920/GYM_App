import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";

function Schedule() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Schedule
          </h1>
          <p className="text-gray-400 mt-1">Manage your teaching schedule</p>
        </div>
      </div>

      {/* Content will be added here */}
    </div>
  );
}

export default Schedule;
