import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";

export default function EmployerDashboardPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleFindMatch = () => {
    if (selectedCategory && selectedLocation) {
      navigate(
        `/employer/matches?category=${selectedCategory}&location=${selectedLocation}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
            SkillLink
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">Employer Dashboard</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-6">
          {/* Main Content - Find Match Card */}
          <main className="flex-1">
            <div className="max-w-2xl mx-auto">
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-12 relative">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FaSearch className="text-4xl text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                      Find Your Perfect Match
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Tell us what you're looking for and we'll connect you with
                      skilled workers
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What kind of worker do you need? *
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200/50 backdrop-blur-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm transition-all shadow-sm"
                      >
                        <option value="">Select a category</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical Work</option>
                        <option value="carpentry">Carpentry</option>
                        <option value="painting">Painting</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="cooking">Cooking/Chef</option>
                        <option value="construction">Construction</option>
                        <option value="gardening">Gardening</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Location *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Andheri West, Mumbai"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200/50 backdrop-blur-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm transition-all shadow-sm placeholder:text-gray-400"
                      />
                    </div>

                    {/* Additional Requirements */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Additional Requirements (Optional)
                      </label>
                      <textarea
                        placeholder="Describe your specific needs..."
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200/50 backdrop-blur-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent text-sm resize-none transition-all shadow-sm placeholder:text-gray-400"
                      />
                    </div>

                    {/* Find Match Button */}
                    <button
                      onClick={handleFindMatch}
                      disabled={!selectedCategory || !selectedLocation}
                      className="w-full py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                      Find Workers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Profile Card */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="relative z-10 text-center">
                  {/* Profile Avatar */}
                  <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-lg">
                    AK
                  </div>
                  <h3 className="font-bold text-gray-800 text-xl mb-1">
                    Arhan Khan
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">Employer</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="backdrop-blur-sm bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100/50">
                      <div className="text-3xl font-bold text-indigo-600">
                        5
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Active Jobs
                      </div>
                    </div>
                    <div className="backdrop-blur-sm bg-purple-50/80 rounded-2xl p-4 border border-purple-100/50">
                      <div className="text-3xl font-bold text-purple-600">
                        12
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Hired</div>
                    </div>
                  </div>

                  {/* Profile Button */}
                  <button
                    onClick={() => navigate("/employer/settings")}
                    className="w-full py-3 backdrop-blur-sm bg-white/80 text-gray-700 rounded-2xl font-medium text-sm hover:bg-white/90 transition-all shadow-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 backdrop-blur-sm bg-white/70 hover:bg-white/90 rounded-2xl text-sm text-gray-700 transition-all shadow-sm">
                      📋 My Jobs
                    </button>
                    <button className="w-full text-left px-4 py-3 backdrop-blur-sm bg-white/70 hover:bg-white/90 rounded-2xl text-sm text-gray-700 transition-all shadow-sm">
                      ⭐ Saved Workers
                    </button>
                    <button className="w-full text-left px-4 py-3 backdrop-blur-sm bg-white/70 hover:bg-white/90 rounded-2xl text-sm text-gray-700 transition-all shadow-sm">
                      💬 Messages
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
