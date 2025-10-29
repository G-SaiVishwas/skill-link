import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBookmark,
  FaRegBookmark,
  FaBriefcase,
  FaSearch,
  FaChevronRight,
  FaUser,
  FaCog,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

interface JobOpportunity {
  id: string;
  employer: {
    id: string;
    name: string;
    org_name?: string;
    verified: boolean;
    photo_url?: string;
  };
  title: string;
  description: string;
  skills_required: string[];
  matched_skills: string[];
  location: {
    city: string;
    distance_km: number | null;
  };
  urgency: string;
  preferred_experience?: string;
  availability_window?: string;
  created_at: string;
  match_score: number;
  skill_match_percent: number;
}

export default function JobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No worker profile found - redirect to onboarding
          console.log('No worker profile found, redirecting to onboarding');
          navigate('/worker/onboard');
          return;
        }
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to load jobs');
      }
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Failed to load job opportunities');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = () => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  };

  const handleSave = (jobId: string) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
    localStorage.setItem('savedJobs', JSON.stringify(Array.from(newSaved)));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filters = [
    { id: "all", label: "All Jobs", count: jobs.length },
    { id: "high-match", label: "High Match", count: jobs.filter(j => j.match_score >= 70).length },
    { id: "nearby", label: "Nearby", count: jobs.filter(j => j.location.distance_km && j.location.distance_km <= 10).length },
    { id: "urgent", label: "Urgent", count: jobs.filter(j => j.urgency === 'urgent' || j.urgency === 'high').length },
    { id: "saved", label: "Saved", count: savedJobs.size },
  ];

  const filteredJobs = jobs.filter((job) => {
    // Apply filter
    if (activeFilter === "high-match" && job.match_score < 70) return false;
    if (activeFilter === "nearby" && (!job.location.distance_km || job.location.distance_km > 10)) return false;
    if (activeFilter === "urgent" && job.urgency !== 'urgent' && job.urgency !== 'high') return false;
    if (activeFilter === "saved" && !savedJobs.has(job.id)) return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.employer.name.toLowerCase().includes(query) ||
        job.skills_required.some(s => s.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-72 fixed left-0 top-0 h-screen bg-white border-r border-gray-100 p-6 overflow-y-auto">
          {/* Profile Section */}
          <div className="mb-8">
            <Link
              to="/worker/profile"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <FaUser className="text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  Your Profile
                </h3>
                <p className="text-xs text-gray-500">Worker Account</p>
              </div>
              <FaCog className="text-lg text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse Jobs
            </h2>
            <p className="text-sm text-gray-500">
              View opportunities matching your skills
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                    activeFilter === filter.id
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{filter.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilter === filter.id
                        ? "bg-indigo-200 text-indigo-800"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {filter.count}
                    </span>
                    {activeFilter === filter.id && (
                      <FaChevronRight className="text-xs" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Jobs available</p>
              <p className="text-2xl font-bold text-indigo-700">
                {filteredJobs.length}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              Browse Jobs
            </h1>
            <div className="relative mb-3">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
            {/* Info Banner */}
            <div className="mb-6 bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <FaBriefcase className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    How it works
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse available jobs that match your skills. Employers will
                    review your profile and contact you directly if they're
                    interested in hiring you for their project.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeFilter === "all"
                  ? "All Jobs"
                  : activeFilter === "saved"
                  ? "Saved Jobs"
                  : `${filters.find((f) => f.id === activeFilter)?.label} Jobs`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} available
              </p>
            </div>

            {/* Jobs Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Error Loading Jobs</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <FaBriefcase className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600">
                  {activeFilter === "saved"
                    ? "You haven't saved any jobs yet"
                    : searchQuery
                    ? "Try adjusting your search or filters"
                    : "Check back later for new opportunities"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.employer.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.employer.name}`}
                            alt={job.employer.name}
                            className="w-12 h-12 rounded-full ring-2 ring-gray-100 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {job.employer.org_name || job.employer.name}
                              </h3>
                              {job.employer.verified && (
                                <FaCheckCircle className="w-4 h-4 text-indigo-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {getTimeAgo(job.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={() => handleSave(job.id)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          {savedJobs.has(job.id) ? (
                            <FaBookmark className="text-indigo-600 text-lg" />
                          ) : (
                            <FaRegBookmark className="text-lg" />
                          )}
                        </button>
                      </div>

                      {/* Job Title */}
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {job.title}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Match Score & Urgency Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchColor(job.match_score)}`}>
                          {job.match_score}% Match
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                          {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
                        </span>
                        {job.location.distance_km && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                            {job.location.distance_km.toFixed(1)} km away
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills_required.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              job.matched_skills.includes(skill)
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {job.matched_skills.includes(skill) && "✓ "}
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 4 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{job.skills_required.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            <span>{job.location.city}</span>
                          </div>
                          {job.availability_window && (
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{job.availability_window}</span>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/worker/job/${job.id}`}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
