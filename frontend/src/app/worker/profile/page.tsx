import { useState, useEffect } from "react";
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
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

interface WorkerProfile {
  id: string;
  user_id: string;
  display_name: string;
  photo_url: string | null;
  voice_intro_url: string | null;
  voice_transcript: string | null;
  bio_generated: string | null;
  bio_generated_local: string | null;
  location_city: string;
  latitude: number | null;
  longitude: number | null;
  suggested_rate: number | null;
  availability_status: string;
  trustrank: number;
  verified: boolean;
  languages: string[];
  voice_sentiment_score: number | null;
  created_at: string;
  updated_at: string;
}

interface UserSkill {
  id: string;
  slug: string;
  name: string;
  proficiency_level: string;
  years_experience: number;
}

interface ProfileData {
  worker: WorkerProfile;
  skills: UserSkill[];
  user: {
    phone: string;
    email: string | null;
  };
  stats: {
    jobs_completed: number;
    completion_rate: number;
    avg_response_time: string;
    avg_rating: number;
  };
}

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/worker/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No profile found - redirect to onboarding
          navigate('/worker/onboard');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();

      if (data.success) {
        setProfileData(data.data);
      } else {
        throw new Error(data.error || 'Failed to load profile');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <FaExclamationCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load profile data'}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { worker, skills, user: userData, stats } = profileData;

  const statsDisplay = [
    {
      icon: FaBriefcase,
      label: "Jobs Completed",
      value: stats?.jobs_completed || 0,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: FaCheckCircle,
      label: "Completion Rate",
      value: `${stats?.completion_rate || 0}%`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: FaClock,
      label: "Response Time",
      value: stats?.avg_response_time || "N/A",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: FaStar,
      label: "Average Rating",
      value: stats?.avg_rating?.toFixed(1) || "New",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
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
                      src={worker.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.display_name}`}
                      alt={worker.display_name}
                      className="w-full h-full rounded-[1.3rem] bg-white object-cover"
                    />
                  </div>
                  {worker.verified && (
                    <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white/90 shadow-xl backdrop-blur-sm">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="mb-4 md:mb-0 relative z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {worker.display_name}
                    </h1>
                    {worker.verified && (
                      <span className="px-3 py-1.5 bg-green-500/10 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full border border-green-200/50">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium text-lg mb-3">
                    {skills.length > 0 ? skills[0].name : 'Service Provider'}
                  </p>
                  <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="font-medium">{worker.location_city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-indigo-500" />
                      <span className="font-medium">
                        {skills.length > 0 && skills[0].years_experience 
                          ? `${skills[0].years_experience}+ years` 
                          : 'Experienced'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-yellow-500" />
                      <span className="font-bold text-gray-900">
                        {worker.trustrank ? (worker.trustrank * 20 / 100 * 5).toFixed(1) : 'New'}
                      </span>
                      <span className="text-gray-500">
                        ({stats?.jobs_completed || 0} jobs)
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
              {statsDisplay.map((stat, index) => {
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
                {worker.bio_generated || worker.voice_transcript || 'No bio available yet. Complete your profile to add a bio.'}
              </p>
              {worker.bio_generated_local && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Local Language:</p>
                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    {worker.bio_generated_local}
                  </p>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 tracking-tight">
                <FaAward className="text-indigo-600" />
                Skills & Expertise
              </h2>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-5 py-2.5 bg-indigo-500/10 backdrop-blur-sm text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-200/50 hover:bg-indigo-500/20 hover:border-indigo-300/50 transition-all hover:scale-105 group relative"
                    >
                      {skill.name}
                      <span className="ml-2 text-xs text-indigo-500/70">
                        {skill.years_experience}y • {skill.proficiency_level}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet. Complete your profile to add skills.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                  <FaUsers className="text-indigo-600" />
                  Client Reviews
                </h2>
                <span className="text-sm text-gray-600 font-medium">
                  0 reviews
                </span>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No reviews yet</p>
                <p className="text-sm text-gray-500">
                  Complete jobs to receive reviews from employers
                </p>
              </div>
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
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {userData.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-indigo-200/30">
                    <FaEnvelope className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.email || 'Not provided'}
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
                ₹{worker.suggested_rate || 'Not set'}
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
                    Ready to work on new projects
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
              {worker.languages && worker.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {worker.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-500/10 backdrop-blur-sm text-gray-700 rounded-xl text-sm font-semibold border border-gray-200/50 hover:bg-gray-500/20 hover:border-gray-300/50 transition-all"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No languages specified</p>
              )}
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
