import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaBriefcase,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaAward,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  // Sample profile data
  const profile = {
    name: "Rajesh Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    specialization: "Residential Plumbing",
    experience: "5-10 years",
    city: "Mumbai, Maharashtra",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    hourlyRate: "₹500-700",
    rating: 4.8,
    totalJobs: 127,
    completionRate: 98,
    responseTime: "< 2 hours",
    verified: true,
    skills: [
      "Plumbing",
      "Bathroom Fitting",
      "Pipe Installation",
      "Water Heater Repair",
      "Drainage Systems",
      "Emergency Repairs",
    ],
    bio: "Experienced plumber with over 8 years of hands-on experience in residential and commercial plumbing. Specialized in modern bathroom installations, pipe repairs, and emergency plumbing services. Committed to delivering high-quality work with attention to detail.",
    languages: ["Hindi", "English", "Marathi"],
    availability: "Available Mon-Sat, 8 AM - 6 PM",
  };

  const stats = [
    {
      icon: FaBriefcase,
      label: "Jobs Completed",
      value: profile.totalJobs,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: FaCheckCircle,
      label: "Completion Rate",
      value: `${profile.completionRate}%`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: FaClock,
      label: "Response Time",
      value: profile.responseTime,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: FaStar,
      label: "Average Rating",
      value: profile.rating,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  const reviews = [
    {
      id: 1,
      employer: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent work! Very professional and completed the bathroom renovation ahead of schedule. Highly recommended!",
      jobType: "Bathroom Renovation",
    },
    {
      id: 2,
      employer: "Amit Patel",
      rating: 5,
      date: "1 month ago",
      comment:
        "Quick response and fixed the plumbing issue efficiently. Will definitely hire again.",
      jobType: "Emergency Pipe Repair",
    },
    {
      id: 3,
      employer: "Sneha Reddy",
      rating: 4,
      date: "2 months ago",
      comment:
        "Good service and reasonable pricing. Minor delay but quality work overall.",
      jobType: "Kitchen Sink Installation",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Top Bar with Logout */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-6">
          {/* Cover Background */}
          <div className="h-40 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          </div>
          {/* Profile Content */}
          <div className="px-8 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 mb-8">
              <div className="flex flex-col md:flex-row md:items-end gap-5">
                {/* Avatar */}
                <div className="relative z-20">
                  <div className="w-36 h-36 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl p-1">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full rounded-[1.3rem] bg-white"
                    />
                  </div>
                  {profile.verified && (
                    <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white/90 shadow-xl backdrop-blur-sm">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="mb-4 md:mb-0 relative z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {profile.name}
                    </h1>
                    {profile.verified && (
                      <span className="px-3 py-1.5 bg-green-500/10 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full border border-green-200/50">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium text-lg mb-3">
                    {profile.specialization}
                  </p>
                  <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="font-medium">{profile.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-indigo-500" />
                      <span className="font-medium">{profile.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-yellow-500" />
                      <span className="font-bold text-gray-900">
                        {profile.rating}
                      </span>
                      <span className="text-gray-500">
                        ({profile.totalJobs} jobs)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl font-semibold hover:bg-white/80 hover:border-gray-300/50 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaEdit className="text-sm" />
                  Edit Profile
                </button>
                <button className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                  Share Profile
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div
                      className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3 shadow-sm`}
                    >
                      <Icon className={`${stat.color} text-xl`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {profile.bio}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 tracking-tight">
                <FaAward className="text-indigo-600" />
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-5 py-2.5 bg-indigo-500/10 backdrop-blur-sm text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-200/50 hover:bg-indigo-500/20 hover:border-indigo-300/50 transition-all hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                  <FaUsers className="text-indigo-600" />
                  Client Reviews
                </h2>
                <span className="text-sm text-gray-600 font-medium">
                  {reviews.length} reviews
                </span>
              </div>

              <div className="space-y-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200/50 last:border-0 pb-5 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {review.employer}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {review.jobType} • {review.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full py-3 text-center text-indigo-600 font-semibold hover:bg-indigo-50/50 backdrop-blur-sm rounded-xl transition-all border border-transparent hover:border-indigo-200/50">
                View All Reviews
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-indigo-200/30">
                    <FaPhone className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-indigo-200/30">
                    <FaEnvelope className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-indigo-200/50 p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
                Hourly Rate
              </h3>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 mb-2">
                {profile.hourlyRate}
              </p>
              <p className="text-sm text-gray-600 font-medium">per hour</p>
            </div>

            {/* Availability */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
                Availability
              </h3>
              <div className="flex items-start gap-3 mb-5">
                <div className="w-11 h-11 bg-green-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-green-200/30">
                  <FaClock className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Available Now
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {profile.availability}
                  </p>
                </div>
              </div>
              <button className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                Contact Worker
              </button>
            </div>

            {/* Languages */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-500/10 backdrop-blur-sm text-gray-700 rounded-xl text-sm font-semibold border border-gray-200/50 hover:bg-gray-500/20 hover:border-gray-300/50 transition-all"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Badge */}
            <div className="bg-linear-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 backdrop-blur-xl rounded-2xl border border-yellow-200/50 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <FaAward className="text-yellow-600 text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    Top Performer
                  </h4>
                  <p className="text-xs text-gray-600 font-medium">
                    This Month
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Recognized for exceptional service quality and customer
                satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
