import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  FaRobot,
  FaMicrophone,
  FaComments,
  FaStar,
  FaBriefcase,
  FaHardHat,
  FaShieldAlt,
  FaGlobe,
  FaClock,
} from "react-icons/fa";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect users who have completed onboarding (have a role)
    if (user && !loading && user.role) {
      if (user.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (user.role === 'employer') {
        navigate('/employer/dashboard');
      }
    }
    // If user exists but has no role, let them stay on landing to choose
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-linear-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navbar */}
      <nav className="backdrop-blur-2xl bg-white/40 border-b border-white/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600"
          >
            SkillLink
          </motion.h1>
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a
              href="#about"
              className="hover:text-indigo-600 transition-colors"
            >
              About
            </a>
            <a href="#how" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="hover:text-indigo-600 transition-colors"
            >
              Contact
            </a>
          </div>
          <Link to="/auth">
            <button className="px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              Where Skills Meet
            </span>
            <br />
            <span className="text-gray-800">Opportunity</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect talented local workers with businesses instantly — powered
            by AI matching in seconds.
          </p>

          {/* Role Selector Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="backdrop-blur-xl bg-white/50 border-2 border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <FaHardHat className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                I'm a Worker
              </h3>
              <p className="text-gray-600 mb-6">
                Showcase your skills with AI-powered profiles. Get hired faster
                with voice intros and instant matches.
              </p>
              <Link to="/worker/onboard">
                <button className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Create Your SkillCard
                </button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              className="backdrop-blur-xl bg-white/50 border-2 border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <FaBriefcase className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                I'm Hiring
              </h3>
              <p className="text-gray-600 mb-6">
                Post jobs with voice or text. AI finds perfect matches instantly
                from verified local talent.
              </p>
              <Link to="/employer/onboard">
                <button className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Post a Job Now
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-3xl font-bold text-indigo-600">10K+</div>
              <div className="text-sm text-gray-600">Active Workers</div>
            </div>
            <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-3xl font-bold text-purple-600">5K+</div>
              <div className="text-sm text-gray-600">Jobs Posted</div>
            </div>
            <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-3xl font-bold text-pink-600">98%</div>
              <div className="text-sm text-gray-600">Match Success</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How SkillLink Works
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Workers */}
            <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                  <FaHardHat className="text-3xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  For Workers
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Record Voice Intro
                    </h4>
                    <p className="text-gray-600 text-sm">
                      10-second audio — AI detects your skills automatically
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Upload Photo & Tag Skills
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Add your picture and confirm AI-suggested skills
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Get AI-Generated Profile
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Professional bio in multiple languages with QR code
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Get Hired
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Employers find you and contact directly via chat
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <FaBriefcase className="text-3xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  For Employers
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Post Job via Voice/Text
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Speak or type your requirements — AI understands both
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      AI Finds Perfect Matches
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Instant matching based on skills, location, and ratings
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Browse Verified Workers
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Swipe through top candidates with TrustRank scores
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Chat, Hire & Rate
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Connect instantly and complete the entire flow in-app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Everything you need to connect, communicate, and complete work
            seamlessly
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRobot />,
                title: "AI-Powered Matching",
                desc: "Smart algorithms connect workers and employers based on skills, location, and availability in real-time.",
                gradient: "from-blue-400 to-indigo-500",
              },
              {
                icon: <FaMicrophone />,
                title: "Voice-First Experience",
                desc: "Speak your job requirements or introduce yourself — our AI understands natural language perfectly.",
                gradient: "from-indigo-400 to-purple-500",
              },
              {
                icon: <FaComments />,
                title: "Real-Time Chat",
                desc: "Built-in messaging with auto-translation support. Communicate effortlessly across languages.",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: <FaShieldAlt />,
                title: "TrustRank System",
                desc: "Verified profiles with transparent ratings. Build reputation through successful jobs and reviews.",
                gradient: "from-pink-400 to-red-500",
              },
              {
                icon: <FaGlobe />,
                title: "Location-Based",
                desc: "Find workers or jobs in your area instantly. Filter by distance and connect with nearby talent.",
                gradient: "from-red-400 to-orange-500",
              },
              {
                icon: <FaClock />,
                title: "Lightning Fast",
                desc: "Post a job and get matched in seconds. No lengthy applications or waiting periods required.",
                gradient: "from-orange-400 to-yellow-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="backdrop-blur-xl bg-white/50 border border-white/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <div className="text-3xl text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative max-w-7xl mx-auto px-6 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Loved by Thousands
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Real stories from workers and employers who found success
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Catering Chef",
                text: "Found 3 catering gigs in my city within 24 hours! The voice intro made it so easy to showcase my personality.",
                rating: 5,
                avatar: "from-pink-400 to-red-400",
              },
              {
                name: "Rahul Mehta",
                role: "Construction Manager",
                text: "AI matching saved me days of searching for skilled plumbers. Got verified workers with great ratings instantly.",
                rating: 5,
                avatar: "from-blue-400 to-indigo-400",
              },
              {
                name: "Neha Gupta",
                role: "Graphic Designer",
                text: "Loved how easy it was to showcase my portfolio with voice intro. Clients can hear my passion before hiring!",
                rating: 5,
                avatar: "from-purple-400 to-pink-400",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="backdrop-blur-xl bg-white/60 border border-white/70 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-linear-to-br ${testimonial.avatar} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                <div className="flex gap-1">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="backdrop-blur-2xl bg-linear-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-white/60 rounded-3xl p-12 md:p-16 shadow-2xl text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of workers and businesses already connecting on
            SkillLink. Whether you're offering your talents or seeking skilled
            professionals, we make it instant and effortless.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-4 rounded-2xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
              Create Free Account
            </button>
            <button className="px-10 py-4 rounded-2xl backdrop-blur-xl bg-white/70 border-2 border-white/80 text-gray-800 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-white/40 border-t border-white/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-4">
                SkillLink
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connecting skilled workers with opportunities through AI-powered
                matching.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">For Workers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Create SkillCard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Post a Job
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Find Talent
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#about"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8 text-center text-gray-600 text-sm">
            <p>
              © 2025 SkillLink. All rights reserved. Built with ❤️ for the
              future of work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
