import { useEffect, useState } from "react";
import { FiUsers, FiSearch, FiRefreshCw } from "react-icons/fi";
import api from "../../utils/api";

function InstructorMembers() {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalMembers: 0 });

  useEffect(() => {
    const load = async () => {
      // Get owner's first gym
      const gymsRes = await api.getGymsByOwner();
      const gym = gymsRes.data?.[0];
      if (!gym) return;
      const instRes = await api.getGymInstructors(gym._id);
      setInstructors(instRes.data || []);
    };
    load();
  }, []);

  const fetchMembers = async (page = 1) => {
    if (!selectedInstructorId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, instructorId: selectedInstructorId, search });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/members?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch members');
      setMembers(data.data || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalMembers: (data.data||[]).length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination(p => ({ ...p, currentPage: 1 }));
    if (selectedInstructorId) fetchMembers(1);
  }, [selectedInstructorId, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Instructor Members</h1>
          <p className="text-gray-400 mt-1">View members assigned to a specific instructor</p>
        </div>
        <button onClick={() => fetchMembers(pagination.currentPage)} className="px-3 py-2 bg-gray-800/60 rounded-lg text-gray-200 hover:bg-gray-700/70 flex items-center gap-2">
          <FiRefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-80">
            <label className="block text-gray-400 text-sm mb-2">Select Instructor</label>
            <select
              value={selectedInstructorId}
              onChange={e => setSelectedInstructorId(e.target.value)}
              className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
            >
              <option value="">-- Choose an instructor --</option>
              {instructors.map(inst => (
                <option key={inst.instructor?._id || inst._id} value={inst.instructor?._id || inst._id}>
                  {inst.instructor?.firstName} {inst.instructor?.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/50 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden">
        {!selectedInstructorId ? (
          <div className="p-8 text-center text-gray-400">Select an instructor to view their members.</div>
        ) : loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No members assigned.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-400 font-medium">Member</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Plan</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Phone</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Joined On</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Payment</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {members.map(m => (
                  <tr key={m._id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-500 text-white flex items-center justify-center font-semibold">
                          {(m.firstName||'')[0]}{(m.lastName||'')[0]}
                        </div>
                        <div className="text-white font-medium">{m.firstName} {m.lastName}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{m.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">{m.membershipPlan?.name || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-gray-300 capitalize">{m.status}</td>
                    <td className="p-4 text-gray-300">{m.phoneNumber || '—'}</td>
                    <td className="p-4 text-gray-300">{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : (m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—')}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          m.paymentDetails?.paymentStatus === 'paid'
                            ? 'bg-green-500/10 text-green-400'
                            : m.paymentDetails?.paymentStatus === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {(m.paymentDetails?.paymentStatus || 'unpaid').toString()
                          .replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${m.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">{m.progress || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorMembers;


