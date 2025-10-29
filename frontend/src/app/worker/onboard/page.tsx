import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaCamera,
  FaTags,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaAward,
  FaStop,
  FaRedo,
} from "react-icons/fa";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function WorkerOnboarding() {
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

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    phone: "",
    email: "",
    // Voice & Photo
    voiceTranscript: "",
    photo: null as File | null,
    photoPreview: "",
    // Skills & Experience
    skills: [] as string[],
    specialization: "",
    yearsOfExperience: "",
    // Location & Rate
    city: "",
    hourlyRate: "",
    bio: "",
  });

  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isListening) {
      interval = window.setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;
          
          // Auto-stop after 15 seconds
          if (newDuration >= 15) {
            stopListening();
            return 15;
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
    setFormData((prev) => ({ ...prev, voiceTranscript: "" }));
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleReRecord = () => {
    resetTranscript();
    setFormData((prev) => ({ ...prev, voiceTranscript: "" }));
  };

  const totalSteps = 7;

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

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleComplete = () => {
    // Save profile data
    console.log("Profile completed:", formData);
    // Navigate to jobs page
    navigate("/worker/jobs");
  };

  const suggestedSkills = [
    "Cooking",
    "Plumbing",
    "Electrical Work",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Gardening",
    "Delivery",
    "Tutoring",
    "Photography",
    "Graphic Design",
    "Web Development",
  ];

  const experienceLevels = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2">
            Create Your SkillCard
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-xl border border-white/60">
            <motion.div
              className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"
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
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                  <FaUser className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Let's start with your basic details.
                </p>

                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-blue-500" />
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
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-blue-500" />
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
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-blue-500" />
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
                      placeholder="e.g., rajesh@example.com"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Email helps employers contact you professionally
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Voice Intro */}
            {currentStep === 2 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <FaMicrophone className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Record Your Voice Intro
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                  Tell us about yourself in 10-15 seconds. Our AI will analyze
                  your voice to detect skills and create a professional profile.
                </p>

                {/* Browser Support Check */}
                {!isSupported && (
                  <div className="mb-6 px-6 py-4 rounded-xl bg-red-100 border border-red-300 text-red-700">
                    ⚠️ Voice recording is not supported in this browser. Please use Chrome, Edge, or Safari.
                  </div>
                )}

                {/* Error Display */}
                {speechError && (
                  <div className="mb-6 px-6 py-4 rounded-xl bg-red-100 border border-red-300 text-red-700">
                    {speechError}
                  </div>
                )}

                <div className="flex flex-col items-center gap-6">
                  {/* Recording Button */}
                  <div className="relative">
                    <button
                      onClick={isListening ? handleStopRecording : handleStartRecording}
                      disabled={!isSupported}
                      className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transform transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isListening
                          ? "bg-red-500 animate-pulse scale-110"
                          : "bg-linear-to-br from-indigo-500 to-purple-600 hover:scale-105"
                      }`}
                    >
                      {isListening ? (
                        <FaStop className="text-5xl text-white" />
                      ) : (
                        <FaMicrophone className="text-5xl text-white" />
                      )}
                    </button>

                    {/* Recording Duration */}
                    {isListening && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {recordingDuration}s / 15s
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <p className="text-sm text-gray-600">
                    {isListening
                      ? "🎤 Listening... Tap to stop"
                      : formData.voiceTranscript
                      ? "✅ Recording complete! Review below or re-record"
                      : "🎙️ Tap microphone to start recording"}
                  </p>

                  {/* Interim Transcript (Live Preview) */}
                  {isListening && interimTranscript && (
                    <div className="mt-4 px-6 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm italic max-w-xl">
                      "{interimTranscript}..."
                    </div>
                  )}

                  {/* Final Transcript Display */}
                  {formData.voiceTranscript && !isListening && (
                    <div className="mt-6 w-full max-w-2xl">
                      <div className="px-6 py-4 rounded-xl bg-green-50 border border-green-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-600 text-xl" />
                            <h3 className="text-lg font-semibold text-green-800">
                              Your Voice Transcript
                            </h3>
                          </div>
                          <button
                            onClick={handleReRecord}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-green-300 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <FaRedo />
                            Re-record
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-left">
                          "{formData.voiceTranscript}"
                        </p>
                        <p className="text-xs text-gray-500 mt-3 text-left">
                          💡 This transcript will be used to detect your skills and generate your professional bio.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {!formData.voiceTranscript && !isListening && (
                    <div className="mt-8 px-6 py-4 rounded-xl bg-blue-50 border border-blue-200 text-left max-w-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        💡 Recording Tips:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Speak clearly about your skills and experience</li>
                        <li>• Mention specific tools or technologies you know</li>
                        <li>• Keep it natural - just introduce yourself!</li>
                        <li>• Example: "Hi, I'm a plumber with 5 years experience..."</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <FaCamera className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Upload Your Photo
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                  A clear photo helps employers recognize you and builds trust.
                </p>

                <div className="flex flex-col items-center gap-6">
                  {formData.photoPreview ? (
                    <div className="relative">
                      <img
                        src={formData.photoPreview}
                        alt="Preview"
                        className="w-48 h-48 rounded-3xl object-cover shadow-2xl border-4 border-white"
                      />
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            photo: null,
                            photoPreview: "",
                          }))
                        }
                        className="absolute top-2 right-2 px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="w-48 h-48 rounded-3xl border-4 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-100 transition-all">
                        <FaCamera className="text-5xl text-indigo-400 mb-3" />
                        <span className="text-indigo-600 font-semibold">
                          Choose Photo
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Skills Selection */}
            {currentStep === 4 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                  <FaTags className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Select Your Skills
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Choose skills that match your expertise. Select at least 3.
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 ${
                        formData.skills.includes(skill)
                          ? "bg-linear-to-r from-pink-500 to-rose-500 text-white"
                          : "bg-white/70 text-gray-700 border border-gray-300 hover:border-pink-400"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {formData.skills.length > 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Selected: {formData.skills.length} skill
                      {formData.skills.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Specialization & Experience */}
            {currentStep === 5 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <FaAward className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Specialization & Experience
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Tell us more about your expertise and experience level.
                </p>

                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaBriefcase className="inline mr-2 text-rose-500" />
                      Specialization *
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialization: e.target.value,
                        }))
                      }
                      placeholder="e.g., Residential Plumbing, Italian Cuisine, etc."
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      What's your main area of expertise?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Years of Experience *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {experienceLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              yearsOfExperience: level,
                            }))
                          }
                          className={`px-4 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                            formData.yearsOfExperience === level
                              ? "bg-linear-to-r from-rose-500 to-orange-500 text-white"
                              : "bg-white/70 text-gray-700 border border-gray-300 hover:border-rose-400"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Location & Rate */}
            {currentStep === 6 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg">
                  <FaMapMarkerAlt className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Location & Rate
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Help employers find you and know your pricing.
                </p>

                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-orange-500" />
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="e.g., Bengaluru"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-orange-500" />
                      Hourly Rate (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hourlyRate: e.target.value,
                        }))
                      }
                      placeholder="e.g., 500"
                      className="w-full px-6 py-4 rounded-xl backdrop-blur-xl bg-white/70 border border-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Average rate for your skills: ₹400-600/hour
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Profile Preview */}
            {currentStep === 7 && (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Your SkillCard Preview
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
                  Here's how employers will see your profile.
                </p>

                <div className="max-w-md mx-auto backdrop-blur-xl bg-white/80 border-2 border-white/90 rounded-3xl p-8 shadow-2xl">
                  {formData.photoPreview && (
                    <img
                      src={formData.photoPreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-indigo-200 shadow-xl"
                    />
                  )}

                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {formData.name || "Your Name"}
                  </h3>
                  <p className="text-center text-gray-600 mb-1">
                    {formData.phone || "+91 XXXXX XXXXX"}
                  </p>
                  {formData.email && (
                    <p className="text-center text-gray-500 text-sm mb-4">
                      {formData.email}
                    </p>
                  )}

                  {/* Specialization & Experience */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {formData.specialization && (
                      <div className="bg-indigo-50 rounded-xl p-3">
                        <p className="text-xs text-indigo-600 font-semibold mb-1">
                          Specialization
                        </p>
                        <p className="text-sm text-gray-800 font-bold">
                          {formData.specialization}
                        </p>
                      </div>
                    )}
                    {formData.yearsOfExperience && (
                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-xs text-purple-600 font-semibold mb-1">
                          Experience
                        </p>
                        <p className="text-sm text-gray-800 font-bold">
                          {formData.yearsOfExperience}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="inline mr-2 text-orange-500" />
                    {formData.city || "Your City"}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-semibold shadow-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-indigo-600 mb-1">
                      ₹{formData.hourlyRate || "---"}/hr
                    </p>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                  </div>

                  <div className="mt-6 p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-sm text-gray-700 italic text-center">
                      "AI-generated professional bio will appear here based on
                      your voice intro and skills."
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
              className="px-8 py-3 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              Next
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaCheckCircle />
              Complete & Find Jobs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
