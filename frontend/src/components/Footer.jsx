import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiUser,
  FiShield,
  FiBook,
  FiHome,
  FiActivity,
  FiHeart,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiDownload
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-10 transform -skew-y-6"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Join Our Fitness Community
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Get exclusive workout tips, nutrition advice, and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input flex-grow"
              />
              <button className="footer-button whitespace-nowrap">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FiActivity className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-white">GymConnect</h4>
              </div>
            </Link>
            <p className="text-lg text-gray-300 leading-relaxed">
              The complete gym management platform connecting fitness enthusiasts, professional instructors, and gym owners in one powerful ecosystem.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">500+</div>
                <div className="text-sm text-gray-400">Gyms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">2K+</div>
                <div className="text-sm text-gray-400">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">50K+</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Follow Us</p>
              <div className="flex space-x-4">
                <a href="#" className="social-icon group">
                  <FiInstagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="social-icon group">
                  <FiFacebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="social-icon group">
                  <FiTwitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="social-icon group">
                  <FiYoutube className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-blue-400" />
              For Customers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/find-gym" className="footer-link hover:text-blue-400 transition-colors">
                  Find Gyms
                </Link>
              </li>
              <li>
                <Link to="/classes" className="footer-link hover:text-blue-400 transition-colors">
                  Browse Classes
                </Link>
              </li>
              <li>
                <Link to="/workouts" className="footer-link hover:text-blue-400 transition-colors">
                  Workout Plans
                </Link>
              </li>
              <li>
                <Link to="/signup" className="footer-link hover:text-blue-400 transition-colors">
                  Join Now
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link hover:text-blue-400 transition-colors">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <FiAward className="w-5 h-5 mr-2 text-emerald-400" />
              For Professionals
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/register-gym" className="footer-link hover:text-emerald-400 transition-colors">
                  Register Your Gym
                </Link>
              </li>
              <li>
                <Link to="/apply-instructor" className="footer-link hover:text-emerald-400 transition-colors">
                  Become Instructor
                </Link>
              </li>
              <li>
                <Link to="/gym-owner-login" className="footer-link hover:text-emerald-400 transition-colors">
                  Gym Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/instructor-login" className="footer-link hover:text-purple-400 transition-colors">
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link hover:text-emerald-400 transition-colors">
                  Partnership Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <FiHeart className="w-5 h-5 mr-2 text-red-400" />
              Support & Contact
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <FiMapPin className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm">+94 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm">hello@gymconnect.lk</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiClock className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>

            {/* Support Links */}
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="footer-link hover:text-violet-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link hover:text-violet-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link hover:text-violet-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professional Login Section */}
      <div className="border-t border-gray-800 py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-white mb-2">Professional Access</h4>
            <p className="text-gray-400">
              Login to your dashboard and manage your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Customer Login */}
            <Link
              to="/login"
              className="group flex flex-col items-center space-y-3 p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-blue-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiUser className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h5 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Customer</h5>
                <p className="text-xs text-gray-400 mt-1">Find gyms & book classes</p>
              </div>
            </Link>

            {/* Gym Owner Login */}
            <Link
              to="/gym-owner-login"
              className="group flex flex-col items-center space-y-3 p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiHome className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h5 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Gym Owner</h5>
                <p className="text-xs text-gray-400 mt-1">Manage your gym business</p>
              </div>
            </Link>

            {/* Instructor Login */}
            <Link
              to="/instructor-login"
              className="group flex flex-col items-center space-y-3 p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h5 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Instructor</h5>
                <p className="text-xs text-gray-400 mt-1">Teach & train clients</p>
              </div>
            </Link>

            {/* Admin Login */}
            <Link
              to="/admin-login"
              className="group flex flex-col items-center space-y-3 p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 hover:bg-red-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiShield className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h5 className="font-semibold text-white group-hover:text-red-400 transition-colors">Admin</h5>
                <p className="text-xs text-gray-400 mt-1">Platform administration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="border-t border-gray-800 py-8 bg-gray-950/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h4 className="text-lg font-bold text-white mb-2">Download Our Mobile App</h4>
              <p className="text-gray-400 text-sm">Get access to workouts, track progress, and book classes on the go</p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <FiDownload className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <FiDownload className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} <span className="text-white font-semibold">GymConnect</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Built with ❤️ for the fitness community in Sri Lanka
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
