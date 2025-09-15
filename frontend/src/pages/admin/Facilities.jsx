import { useEffect, useState } from "react";
import axios from "axios";
import { addGymWorkouts } from "../../services/gymService";

function AdminFacilities() {
  const [gyms, setGyms] = useState([]);
  const [selectedGymId, setSelectedGymId] = useState("");
  const [gymWorkouts, setGymWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (gymId) => {
    try {
      setLoading(true);
      setError(null);
      const [gymsRes, gifsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/gyms`, { withCredentials: true, params: { status: 'approved' } }),
        axios.get(`${import.meta.env.VITE_API_URL}/gifs`)
      ]);
      setGyms(gymsRes.data?.data || []);
      setAllWorkouts(gifsRes.data?.data || []);
      const chosen = gymId || gymsRes.data?.data?.[0]?._id;
      if (chosen) {
        setSelectedGymId(chosen);
        const gw = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/${chosen}/workouts`, { withCredentials: true });
        setGymWorkouts(gw.data?.data || []);
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSelectGym = async (id) => {
    setSelectedGymId(id);
    try {
      const gw = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/${id}/workouts`, { withCredentials: true });
      setGymWorkouts(gw.data?.data || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to load gym workouts');
    }
  };

  const toggleSelect = (id) => {
    setSelectedToAdd(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (!selectedGymId || selectedToAdd.length === 0) return;
    try {
      setLoading(true);
      await addGymWorkouts(selectedGymId, selectedToAdd);
      setSelectedToAdd([]);
      await handleSelectGym(selectedGymId);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const currentIds = new Set(gymWorkouts.map(w => w._id));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Admin Facilities</h1>
      {error && <div className="bg-red-900/20 border border-red-500/50 rounded p-3 text-red-300">{error}</div>}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-300">Select Gym:</span>
          <select value={selectedGymId} onChange={(e) => handleSelectGym(e.target.value)} className="bg-gray-900/50 text-white rounded px-3 py-2 border border-gray-700/50">
            {gyms.map(g => (
              <option key={g._id} value={g._id}>{g.gymName}</option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">Current Gym Workouts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gymWorkouts.length === 0 && <div className="text-gray-400">No workouts</div>}
            {gymWorkouts.map(w => (
              <div key={w._id} className="bg-gray-900/40 border border-gray-700 rounded-lg p-3">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <img src={w.url} alt={w.name} className="max-h-48" />
                </div>
                <div className="mt-2 text-violet-300 font-medium">{w.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold">Add From Admin Workouts</h2>
            <button onClick={handleAdd} disabled={loading || selectedToAdd.length === 0} className="px-4 py-2 bg-violet-600 text-white rounded-lg disabled:opacity-50">Add Selected</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allWorkouts.map(w => (
              <label key={w._id} className={`p-3 rounded-lg bg-gray-900/50 border ${selectedToAdd.includes(w._id) ? 'border-violet-500' : 'border-gray-700'} flex items-start gap-3`}>
                <input type="checkbox" disabled={currentIds.has(w._id)} checked={selectedToAdd.includes(w._id)} onChange={() => toggleSelect(w._id)} className="mt-1" />
                <div className="flex-1">
                  <div className="text-violet-300 font-medium flex items-center gap-2">{w.name}{currentIds.has(w._id) && <span className="text-xs text-green-300">(Added)</span>}</div>
                  <div className="mt-2 bg-black/60 rounded overflow-hidden">
                    <img src={w.url} alt={w.name} className="max-h-40 mx-auto" />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFacilities;


