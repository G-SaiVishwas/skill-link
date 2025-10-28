import { useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaTimes,
  FaCheck,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";

interface Worker {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  skills: string[];
  experience: string;
  availability: string;
  completedJobs: number;
  description: string;
}

const mockWorkers: Worker[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    title: "Master Plumber",
    location: "Andheri West, Mumbai",
    avatar: "RK",
    rating: 4.8,
    reviews: 127,
    hourlyRate: "₹500-700",
    skills: [
      "Plumbing",
      "Pipe Installation",
      "Bathroom Fitting",
      "Water Heater",
    ],
    experience: "12 years",
    availability: "Available",
    completedJobs: 245,
    description:
      "Expert plumber with 12+ years of experience in residential and commercial projects.",
  },
  {
    id: "2",
    name: "Priya Sharma",
    title: "Professional Electrician",
    location: "Bandra East, Mumbai",
    avatar: "PS",
    rating: 4.9,
    reviews: 89,
    hourlyRate: "₹600-800",
    skills: ["Electrical Wiring", "Panel Installation", "LED Setup", "Solar"],
    experience: "8 years",
    availability: "Available",
    completedJobs: 178,
    description:
      "Certified electrician specializing in modern electrical systems and solar installations.",
  },
  {
    id: "3",
    name: "Mohammed Ali",
    title: "Senior Carpenter",
    location: "Malad West, Mumbai",
    avatar: "MA",
    rating: 4.7,
    reviews: 156,
    hourlyRate: "₹450-650",
    skills: ["Carpentry", "Furniture Making", "Wood Work", "Interior"],
    experience: "15 years",
    availability: "Busy",
    completedJobs: 312,
    description:
      "Experienced carpenter specializing in custom furniture and interior woodwork.",
  },
];

export default function MatchesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";

  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(
    new Set()
  );
  const [rejectedWorkers, setRejectedWorkers] = useState<Set<string>>(
    new Set()
  );
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers((prev) => {
      const newSet = new Set(prev);
      newSet.add(workerId);
      return newSet;
    });
  };

  const handleRejectWorker = (workerId: string) => {
    setRejectedWorkers((prev) => {
      const newSet = new Set(prev);
      newSet.add(workerId);
      return newSet;
    });
  };

  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      !rejectedWorkers.has(worker.id) && !selectedWorkers.has(worker.id)
  );

  const getSelectedWorkersData = () => {
    return mockWorkers.filter((worker) => selectedWorkers.has(worker.id));
  };

  const handleConfirmSelection = () => {
    if (selectedWorkers.size > 0) {
      setShowComparison(true);
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
              SkillLink
            </h1>
          </div>
          <p className="text-sm text-gray-600">Worker Matches</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Search Info */}
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Available Workers
              </h2>
              <p className="text-sm text-gray-600">
                {category} • {location}
              </p>
            </div>
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="px-5 py-3 backdrop-blur-sm bg-white/80 text-gray-700 border border-gray-200/50 rounded-2xl font-medium text-sm hover:bg-white/90 transition-all shadow-sm"
            >
              New Search
            </button>
          </div>
        </div>

        {/* Worker Cards */}
        <div className="space-y-6">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all relative overflow-hidden"
              >
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

                <div className="relative z-10 flex gap-8">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-28 h-28 bg-linear-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {worker.avatar}
                    </div>
                  </div>

                  {/* Worker Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {worker.name}
                        </h3>
                        <p className="text-base text-gray-600 mt-1">
                          {worker.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 backdrop-blur-sm bg-yellow-50/80 px-4 py-2 rounded-2xl border border-yellow-100/50">
                        <FaStar className="text-yellow-500" />
                        <span className="font-semibold text-gray-800 text-base">
                          {worker.rating}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({worker.reviews})
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                      {worker.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {worker.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 backdrop-blur-sm bg-indigo-50/80 text-indigo-700 text-xs font-medium rounded-xl border border-indigo-100/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200/50">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span>{worker.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-blue-400" />
                        <span>{worker.experience}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {worker.hourlyRate}/hr
                        </span>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            worker.availability === "Available"
                              ? "bg-green-50/80 text-green-700 border border-green-100/50"
                              : "bg-gray-100/80 text-gray-600 border border-gray-200/50"
                          }`}
                        >
                          {worker.availability}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleSelectWorker(worker.id)}
                        className="flex-1 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <FaCheck />
                        Select Worker
                      </button>
                      <button
                        onClick={() => handleRejectWorker(worker.id)}
                        className="px-8 py-4 backdrop-blur-sm bg-gray-100/80 text-gray-700 rounded-2xl font-semibold text-base hover:bg-gray-200/80 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Pass
                      </button>
                      <button className="px-8 py-4 backdrop-blur-sm bg-white/80 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-semibold text-base hover:bg-white/90 transition-all shadow-sm flex items-center justify-center gap-2">
                        <FaPhone />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 backdrop-blur-xl bg-white/60 rounded-3xl border border-white/20 shadow-xl">
              <p className="text-gray-600 text-lg">
                No more workers available. Try a new search!
              </p>
            </div>
          )}
        </div>

        {/* Selected Workers Summary */}
        {selectedWorkers.size > 0 && !showComparison && (
          <div className="mt-8 backdrop-blur-xl bg-green-50/80 border border-green-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-3 text-xl">
                  Selected Workers ({selectedWorkers.size})
                </h3>
                <p className="text-base text-green-700">
                  You've selected {selectedWorkers.size} worker(s). Click
                  confirm to compare and finalize your choice.
                </p>
              </div>
              <button
                onClick={handleConfirmSelection}
                className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold text-base hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {showComparison && selectedWorkers.size > 0 && (
          <div className="mt-8 backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Worker Comparison
                  </h2>
                  <p className="text-gray-600">
                    Compare selected workers to make the best hiring decision
                  </p>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-6 py-3 backdrop-blur-sm bg-white/80 text-gray-700 border border-gray-200/50 rounded-2xl font-medium text-sm hover:bg-white/90 transition-all shadow-sm"
                >
                  Back to Results
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Criteria
                      </th>
                      {getSelectedWorkersData().map((worker) => (
                        <th
                          key={worker.id}
                          className="text-center py-4 px-6 font-semibold text-gray-800 text-base min-w-[200px]"
                        >
                          {worker.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Avatar Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Profile
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                              {worker.avatar}
                            </div>
                            <span className="text-sm text-gray-600">
                              {worker.title}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Rating Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Rating
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <FaStar className="text-yellow-500 text-lg" />
                            <span className="text-lg font-bold text-gray-800">
                              {worker.rating}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({worker.reviews} reviews)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Experience Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Experience
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <span className="text-base font-semibold text-gray-800">
                            {worker.experience}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Hourly Rate Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Hourly Rate
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <span className="text-base font-bold text-indigo-600">
                            {worker.hourlyRate}/hr
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Completed Jobs Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Completed Jobs
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <span className="text-base font-semibold text-gray-800">
                            {worker.completedJobs}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Availability Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Availability
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                              worker.availability === "Available"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {worker.availability}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Location Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm">
                        Location
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <span className="text-sm text-gray-700">
                            {worker.location}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Skills Row */}
                    <tr className="hover:bg-white/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm align-top">
                        Skills
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {worker.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 backdrop-blur-sm bg-indigo-50/80 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* AI Recommendation Row */}
                    <tr className="bg-indigo-50/50 hover:bg-indigo-50/70 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-700 text-sm align-top">
                        AI Recommendation
                      </td>
                      {getSelectedWorkersData().map((worker, index) => (
                        <td key={worker.id} className="text-center py-4 px-6">
                          <div className="flex flex-col items-center gap-2">
                            {index === 0 ? (
                              <>
                                <div className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg">
                                  ⭐ Best Match
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  Highest rating and most experience
                                </p>
                              </>
                            ) : index === 1 ? (
                              <>
                                <div className="px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-sm">
                                  💰 Best Value
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  Great balance of quality and price
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium text-sm">
                                  Good Option
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  Solid choice for your needs
                                </p>
                              </>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Action Row */}
                    <tr>
                      <td className="py-6 px-4 font-medium text-gray-700 text-sm">
                        Action
                      </td>
                      {getSelectedWorkersData().map((worker) => (
                        <td key={worker.id} className="text-center py-6 px-6">
                          <button className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                            Hire {worker.name.split(" ")[0]}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
