import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaGlobe,
  FaCamera,
  FaSave,
  FaBell,
  FaCheckCircle,
} from "react-icons/fa";

export default function EmployerSettingsPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"individual" | "business">(
    "individual"
  );

  // Mock data - replace with actual data from API
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "Arhan Khan",
    email: "arhan.khan@example.com",
    phone: "+91 98765 43210",
    avatar: "AK",

    // Business Information (optional)
    businessName: "",
    businessType: "",
    industry: "",
    businessSize: "",
    website: "",

    // Location
    address: "123, Marine Drive",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400020",

    // About
    bio: "Looking to hire skilled workers for various projects and events.",

    // Preferences
    notificationsEnabled: true,
    emailUpdates: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: API call to save profile
    console.log("Saving profile:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Profile Settings
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <FaSave className="text-xs" />
            Save Changes
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-semibold">
                {formData.avatar}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-indigo-600 hover:bg-gray-50 transition-colors border border-gray-200">
                <FaCamera className="text-sm" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {formData.fullName}
              </h2>
              <p className="text-gray-500 mb-4">{formData.email}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-xs text-gray-400" />
                  <span>
                    {formData.city}, {formData.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-xs text-gray-400" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Type */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Type
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAccountType("individual")}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    accountType === "individual"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaUser
                      className={
                        accountType === "individual"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                    />
                    <span className="font-medium text-gray-900">
                      Individual
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    For personal hiring needs
                  </p>
                </button>
                <button
                  onClick={() => setAccountType("business")}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    accountType === "business"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaBuilding
                      className={
                        accountType === "business"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                    />
                    <span className="font-medium text-gray-900">Business</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    For company/organization
                  </p>
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information (conditionally shown) */}
            {accountType === "business" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                  Business Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      >
                        <option value="">Select type</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Public Limited">Public Limited</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Sole Proprietorship">
                          Sole Proprietorship
                        </option>
                        <option value="LLP">LLP</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                        placeholder="e.g., Construction, Real Estate"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Size
                      </label>
                      <select
                        name="businessSize"
                        value={formData.businessSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      >
                        <option value="">Select size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="50-200 employees">
                          50-200 employees
                        </option>
                        <option value="200-500 employees">
                          200-500 employees
                        </option>
                        <option value="500+ employees">500+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Location
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="400020"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                About
              </h3>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none transition-all"
                placeholder="Tell us about yourself or your business..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This will help workers understand your requirements better
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="text-lg font-semibold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Workers Hired</span>
                  <span className="text-lg font-semibold text-gray-900">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold text-gray-900">
                      4.8
                    </span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Notifications
              </h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationsEnabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificationsEnabled: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FaBell className="text-xs text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Push Notifications
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Get notified about matches and messages
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.emailUpdates}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailUpdates: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-xs text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Email Updates
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Receive weekly updates via email
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 mb-1">
                    Account Verified
                  </h3>
                  <p className="text-xs text-green-700">
                    Your account is verified and active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
