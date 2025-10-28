import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "react-icons/fa";

interface Job {
  id: string;
  title: string;
  employer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  location: string;
  hourlyRate: string;
  duration: string;
  category: string;
  skills: string[];
  postedTime: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Plumber needed for bathroom renovation",
      employer: {
        name: "Rajesh Kumar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        verified: true,
      },
      description:
        "Looking for an experienced plumber to renovate a master bathroom. Work includes installing new fixtures, re-piping, and modern fittings. Expected to take 3-4 days.",
      location: "Andheri West, Mumbai",
      hourlyRate: "₹500-700",
      duration: "3-4 days",
      category: "Plumbing",
      skills: ["Plumbing", "Bathroom Fitting", "Pipe Installation"],
      postedTime: "2h ago",
      likes: 12,
      comments: 5,
      isLiked: false,
      isSaved: false,
    },
    {
      id: "2",
      title: "Experienced electrician for home wiring",
      employer: {
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        verified: true,
      },
      description:
        "Need a certified electrician to rewire a 2BHK apartment. Must have experience with modern electrical systems and safety certifications.",
      location: "Whitefield, Bangalore",
      hourlyRate: "₹600-800",
      duration: "2-3 days",
      category: "Electrical",
      skills: ["Electrical Wiring", "Safety Certification"],
      postedTime: "5h ago",
      likes: 8,
      comments: 3,
      isLiked: false,
      isSaved: true,
    },
    {
      id: "3",
      title: "Chef needed for wedding event",
      employer: {
        name: "Meera & Arjun Wedding",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        verified: false,
      },
      description:
        "Looking for an experienced chef to prepare traditional North Indian cuisine for 150 guests. Event on Nov 15th. Must have experience with large events.",
      location: "Connaught Place, Delhi",
      hourlyRate: "₹1200-1500",
      duration: "1 day",
      category: "Cooking",
      skills: ["Cooking", "Catering", "Event Management"],
      postedTime: "1d ago",
      likes: 24,
      comments: 12,
      isLiked: true,
      isSaved: false,
    },
    {
      id: "4",
      title: "Carpenter for custom furniture",
      employer: {
        name: "Home Decor Studio",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Studio",
        verified: true,
      },
      description:
        "Need a skilled carpenter to build custom wardrobes and study table. Design will be provided. Quality craftsmanship required.",
      location: "Koramangala, Bangalore",
      hourlyRate: "₹450-600",
      duration: "5-7 days",
      category: "Carpentry",
      skills: ["Carpentry", "Furniture Making", "Wood Work"],
      postedTime: "3h ago",
      likes: 6,
      comments: 2,
      isLiked: false,
      isSaved: false,
    },
  ]);

  const filters = [
    { id: "all", label: "All Jobs" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "cooking", label: "Cooking" },
    { id: "carpentry", label: "Carpentry" },
    { id: "saved", label: "Saved" },
  ];

  const handleSave = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "saved") return job.isSaved;
    return job.category.toLowerCase() === activeFilter;
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
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeFilter === filter.id
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                  {filter.id === activeFilter && (
                    <span className="float-right mt-0.5">
                      <FaChevronRight className="text-xs" />
                    </span>
                  )}
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
                          src={job.employer.avatar}
                          alt={job.employer.name}
                          className="w-12 h-12 rounded-full ring-2 ring-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {job.employer.name}
                            </h3>
                            {job.employer.verified && (
                              <svg
                                className="w-4 h-4 text-indigo-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {job.postedTime}
                          </p>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSave(job.id)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {job.isSaved ? (
                          <FaBookmark className="text-indigo-600 text-lg" />
                        ) : (
                          <FaRegBookmark className="text-lg" />
                        )}
                      </button>
                    </div>

                    {/* Job Title */}
                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                      {job.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <FaMapMarkerAlt className="text-xs text-red-400" />
                          <span className="text-xs font-medium">
                            {job.location.split(",")[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <FaClock className="text-xs text-blue-400" />
                          <span className="text-xs font-medium">
                            {job.duration}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-700">
                          {job.hourlyRate}
                        </p>
                        <p className="text-xs text-gray-500">per hour</p>
                      </div>
                    </div>

                    {/* Info Message */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-center text-gray-500">
                        💼 Employers will contact you if interested
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FaBriefcase className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or check back later for new
                  opportunities
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
