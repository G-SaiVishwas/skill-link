import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaIndustry,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaUsers,
  FaMicrophone,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaStop,
  FaRedo,
} from "react-icons/fa";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  
  // Speech recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Recording duration timer
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const [hiringType, setHiringType] = useState<"company" | "personal">(
    "company"
  );
  const [formData, setFormData] = useState({
    // Personal Details
    name: "",
    phone: "",
    email: "",
    // Voice intro
    voiceTranscript: "",
    // Company/Organization Details
    companyName: "",
    companyLogo: null as File | null,
    logoPreview: "",
    industry: "",
    location: "",
    companySize: "",
    hiringNeeds: [] as string[],
    description: "",
    jobTitle: "",
  });

  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isListening) {
      interval = window.setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;
          
          // Auto-stop after 20 seconds
          if (newDuration >= 20) {
            stopListening();
            return 20;
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [isListening, stopListening]);

  // Save transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      setFormData((prev) => ({
        ...prev,
        voiceTranscript: transcript,
      }));
    }
  }, [isListening, transcript]);

  const handleStartRecording = () => {
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleHiringNeedToggle = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      hiringNeeds: prev.hiringNeeds.includes(need)
        ? prev.hiringNeeds.filter((n) => n !== need)
        : [...prev.hiringNeeds, need],
    }));
  };

  const industries = [
    "Construction",
    "Healthcare",
    "Hospitality",
    "Retail",
    "Technology",
    "Education",
    "Manufacturing",
    "Transportation",
    "Food & Beverage",
    "Personal Events (Weddings, Parties)",
    "Home Services",
    "Personal Projects",
    "Other",
  ];

  const companySizes = [
    "Just Me",
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees",
  ];

  const commonHiringNeeds = [
    "Skilled Labor",
    "Temporary Help",
    "Full-time Staff",
    "Project-based",
    "Seasonal Workers",
    "Specialized Skills",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 mb-2">
            Set Up Your Employer Profile
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-xl border border-white/60">
            <motion.div
              className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-rose-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-2xl bg-white/60 border border-white/70 rounded-3xl p-8 md:p-12 shadow-2xl mb-8"
          >
            {/* Step 1: Voice Intro (Optional) */}
            {currentStep === 1 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                  <FaMicrophone className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Introduce Yourself (Optional)
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Record a short voice message to help workers know who they'll
                  be working with. Talk about yourself and what you're looking for.
                </p>

                {!isSupported && (
                  <div className="max-w-lg mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm text-center">
                      ⚠️ Voice recording is not supported in your browser. Please use Chrome, Edge, or Safari.
                    </p>
                  </div>
                )}

                {speechError && (
                  <div className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm text-center">
                      ❌ {speechError}
                    </p>
                  </div>
                )}

                <div className="max-w-lg mx-auto">
                  <div className="backdrop-blur-xl bg-white/70 border border-white/80 rounded-2xl p-8">
                    <div className="text-center">
                      {!isListening ? (
                        <button
                          onClick={handleStartRecording}
                          disabled={!isSupported}
                          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all transform hover:scale-110 shadow-2xl ${
                            !isSupported
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-linear-to-br from-orange-400 to-amber-500 hover:shadow-3xl"
                          }`}
                        >
                          <FaMicrophone className="text-4xl text-white" />
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <button
                            onClick={handleStopRecording}
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-red-500 animate-pulse shadow-2xl hover:bg-red-600 transition-all"
                          >
                            <FaStop className="text-4xl text-white" />
                          </button>
                          <div className="text-lg font-semibold text-red-600">
                            Recording... {recordingDuration}s / 20s
                          </div>
                        </div>
                      )}
                      
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {isListening ? "Listening..." : formData.voiceTranscript ? "Recording Complete!" : "Tap to Start"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isListening
                          ? "Speak clearly about yourself and what you're looking for"
                          : "15-20 seconds is perfect"}
                      </p>

                      {/* Show transcript */}
                      {(transcript || interimTranscript || formData.voiceTranscript) && (
                        <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <p className="text-sm font-semibold text-orange-700 mb-2">
                            {isListening ? "Live Transcript:" : "Your Recording:"}
                          </p>
                          <p className="text-gray-700 italic">
                            "{isListening ? (transcript + " " + interimTranscript) : formData.voiceTranscript}"
                          </p>
                        </div>
                      )}

                      {/* Re-record button */}
                      {formData.voiceTranscript && !isListening && (
                        <button
                          onClick={handleStartRecording}
                          className="mt-4 px-6 py-2 rounded-lg bg-white border-2 border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-all flex items-center gap-2 mx-auto"
                        >
                          <FaRedo />
                          Re-record
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Skip this step if you prefer - you can always add it later
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Personal Details */}
            {currentStep === 5 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <FaUser className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Let's start with your basic details. This helps workers
                  connect with you.
                </p>

                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-purple-500" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-purple-500" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-purple-500" />
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      For updates and important notifications
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Hiring Type & Company/Organization Info */}
            {currentStep === 2 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <FaBuilding className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Hiring For
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Are you hiring for a company or for personal needs?
                </p>

                {/* Hiring Type Selector */}
                <div className="max-w-lg mx-auto mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setHiringType("company")}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        hiringType === "company"
                          ? "border-purple-500 bg-purple-50 shadow-lg"
                          : "border-white/60 bg-white/40 hover:border-purple-300"
                      }`}
                    >
                      <FaBuilding
                        className={`text-4xl mx-auto mb-3 ${
                          hiringType === "company"
                            ? "text-purple-500"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-semibold ${
                          hiringType === "company"
                            ? "text-purple-700"
                            : "text-gray-600"
                        }`}
                      >
                        Company/Business
                      </p>
                    </button>
                    <button
                      onClick={() => setHiringType("personal")}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        hiringType === "personal"
                          ? "border-pink-500 bg-pink-50 shadow-lg"
                          : "border-white/60 bg-white/40 hover:border-pink-300"
                      }`}
                    >
                      <FaHome
                        className={`text-4xl mx-auto mb-3 ${
                          hiringType === "personal"
                            ? "text-pink-500"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-semibold ${
                          hiringType === "personal"
                            ? "text-pink-700"
                            : "text-gray-600"
                        }`}
                      >
                        Personal Projects
                      </p>
                    </button>
                  </div>
                </div>

                <div className="max-w-lg mx-auto space-y-6">
                  {/* Company/Project Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {hiringType === "company"
                        ? "Company Name *"
                        : "Project/Event Name *"}
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      placeholder={
                        hiringType === "company"
                          ? "e.g., ABC Construction Ltd."
                          : "e.g., My Wedding, Home Renovation"
                      }
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaIndustry className="inline mr-2 text-purple-500" />
                      {hiringType === "company" ? "Industry *" : "Category *"}
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    >
                      <option value="">
                        {hiringType === "company"
                          ? "Select industry"
                          : "Select category"}
                      </option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-purple-500" />
                      {hiringType === "company"
                        ? "Primary Location *"
                        : "Event/Project Location *"}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="e.g., Mumbai, Maharashtra"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Organization Size & Description */}
            {currentStep === 3 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                  <FaUsers className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  {hiringType === "company"
                    ? "Company Details"
                    : "Project Details"}
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  {hiringType === "company"
                    ? "Help workers understand your organization better."
                    : "Tell workers more about your project or event."}
                </p>

                <div className="max-w-lg mx-auto space-y-6">
                  {/* Company/Team Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {hiringType === "company"
                        ? "Company Size"
                        : "Team/Project Size"}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {companySizes.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              companySize: size,
                            }))
                          }
                          className={`px-4 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                            formData.companySize === size
                              ? "bg-linear-to-r from-pink-500 to-rose-500 text-white"
                              : "bg-white/70 text-gray-700 border border-gray-300 hover:border-pink-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {hiringType === "company"
                        ? "About Your Company"
                        : "About Your Project/Event"}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder={
                        hiringType === "company"
                          ? "Tell workers what your company does and what makes it a great place to work..."
                          : "Describe your project or event - what you're planning, timeline, and what kind of help you need..."
                      }
                      rows={5}
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Hiring Needs */}
            {currentStep === 4 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <FaIndustry className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Your Hiring Needs
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  What types of workers are you typically looking for?
                </p>

                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {commonHiringNeeds.map((need) => (
                    <button
                      key={need}
                      onClick={() => handleHiringNeedToggle(need)}
                      className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 ${
                        formData.hiringNeeds.includes(need)
                          ? "bg-linear-to-r from-rose-500 to-orange-500 text-white"
                          : "bg-white/70 text-gray-700 border border-gray-300 hover:border-rose-400"
                      }`}
                    >
                      {need}
                    </button>
                  ))}
                </div>

                {formData.hiringNeeds.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Selected: {formData.hiringNeeds.length} hiring need
                      {formData.hiringNeeds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Profile Preview & Optional Job Post */}
            {currentStep === 6 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Profile Complete!
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Review your profile and optionally post your first job.
                </p>

                <div className="max-w-lg mx-auto backdrop-blur-xl bg-white/80 border-2 border-white/90 rounded-3xl p-8 shadow-2xl mb-8">
                  {formData.logoPreview && (
                    <img
                      src={formData.logoPreview}
                      alt={
                        hiringType === "company"
                          ? "Company Logo"
                          : "Profile Picture"
                      }
                      className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover border-4 border-purple-200 shadow-lg"
                    />
                  )}

                  {/* Personal Details */}
                  <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-purple-700 mb-3 text-center">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-center text-gray-700">
                        <FaUser className="inline mr-2 text-purple-500" />
                        <span className="font-semibold">
                          {formData.name || "Your Name"}
                        </span>
                      </p>
                      <p className="text-center text-gray-700">
                        <FaPhone className="inline mr-2 text-purple-500" />
                        {formData.phone || "+91 XXXXX XXXXX"}
                      </p>
                      {formData.email && (
                        <p className="text-center text-gray-600 text-sm">
                          <FaEnvelope className="inline mr-2 text-purple-500" />
                          {formData.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {formData.companyName ||
                      (hiringType === "company"
                        ? "Your Company"
                        : "Your Project")}
                  </h3>
                  <p className="text-center text-gray-600 mb-1">
                    {formData.industry || "Industry"} •{" "}
                    {formData.companySize || "Size"}
                  </p>
                  <p className="text-center text-gray-500 text-sm mb-6">
                    <FaMapMarkerAlt className="inline mr-1" />
                    {formData.location || "Location"}
                  </p>

                  {formData.hiringNeeds.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                        Hiring For:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {formData.hiringNeeds.map((need) => (
                          <span
                            key={need}
                            className="px-3 py-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold shadow-md"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.description && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
                      <p className="text-sm text-gray-700 text-center italic">
                        "{formData.description}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Job Post Option */}
                <div className="max-w-lg mx-auto backdrop-blur-xl bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-300/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <FaBriefcase className="text-3xl text-blue-600" />
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Post Your First Job (Optional)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Start finding workers right away
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          jobTitle: e.target.value,
                        }))
                      }
                      placeholder="e.g., Plumber needed for home renovation"
                      className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      You can skip this and post a job later from your dashboard
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-all ${
              currentStep === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white/70 text-gray-800 border border-gray-300 hover:shadow-xl hover:scale-105"
            }`}
          >
            <FaArrowLeft />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Next
              <FaArrowRight />
            </button>
          ) : (
            <button 
              onClick={() => navigate("/employer/dashboard")}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaCheckCircle />
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
