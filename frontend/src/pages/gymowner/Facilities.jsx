import { useEffect, useState } from "react";
import { FiPlus, FiX, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import { getGymWorkouts, addGymWorkouts, removeGymWorkout } from "../../services/gymService";

function GymOwnerFacilities() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [gymId, setGymId] = useState(null);
  const [currentWorkouts, setCurrentWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  const loadGym = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get owner's gyms
      const gymsRes = await axios.get(`${import.meta.env.VITE_API_URL}/gyms/owner/gyms`, { withCredentials: true });
      const gym = gymsRes.data?.data?.[0];
      if (!gym) {
        setError("No gym found for this account");
        return;
      }
      setGymId(gym._id);
      // Current workouts for gym
      const workoutsRes = await getGymWorkouts(gym._id);
      // workoutsRes is already the array from the API helper
      setCurrentWorkouts(workoutsRes || []);
      // All admin workouts (GIFs)
      const allRes = await axios.get(`${import.meta.env.VITE_API_URL}/gifs`);
      setAllWorkouts(allRes.data?.data || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGym(); }, []);

  const toggleSelect = (id) => {
    setSelectedToAdd(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (!gymId || selectedToAdd.length === 0) return;
    try {
      setSaving(true);
      await addGymWorkouts(gymId, selectedToAdd);
      setSelectedToAdd([]);
      await loadGym();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to add workouts");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (workoutId) => {
    if (!gymId) return;
    try {
      setSaving(true);
      await removeGymWorkout(gymId, workoutId);
      await loadGym();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to remove workout");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Facilities</h1>
        <button onClick={loadGym} className="px-3 py-2 bg-gray-800/60 rounded-lg text-gray-200 hover:bg-gray-700/70 flex items-center gap-2">
          <FiRefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h2 className="text-white text-lg font-semibold mb-4">Currently Added Workouts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentWorkouts.length === 0 && (
                <div className="text-gray-400">No workouts added yet</div>
              )}
              {currentWorkouts.map(w => (
                <div key={w._id} className="bg-gray-900/40 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <img src={w.url} alt={w.name} className="max-h-48" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-violet-300 font-medium">{w.name}</span>
                    <button onClick={() => handleRemove(w._id)} className="text-red-300 hover:text-red-200">
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Add More Workouts (from Admin list)</h2>
              <button onClick={handleAdd} disabled={saving || selectedToAdd.length === 0} className="px-4 py-2 bg-violet-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                <FiPlus /> Add Selected
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allWorkouts.map(w => {
                const alreadyAdded = currentWorkouts.some(cw => cw._id === w._id);
                const checked = selectedToAdd.includes(w._id);
                return (
                  <label key={w._id} className={`w-full p-3 rounded-lg bg-gray-900/50 border ${checked ? 'border-violet-500' : 'border-gray-700'} flex items-start gap-3 cursor-pointer`}>
                    <input type="checkbox" disabled={alreadyAdded} checked={checked} onChange={() => toggleSelect(w._id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="text-violet-300 font-medium flex items-center gap-2">
                        {w.name}
                        {alreadyAdded && <span className="text-xs text-green-300">(Added)</span>}
                      </div>
                      <div className="mt-2 bg-black/60 rounded overflow-hidden">
                        <img src={w.url} alt={w.name} className="max-h-40 mx-auto" />
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GymOwnerFacilities;


