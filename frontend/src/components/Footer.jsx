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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <h4 className="text-3xl font-bold text-white">FitConnect</h4>
            </Link>
            <p className="text-lg">
              Transforming lives through fitness and wellness, one workout at a
              time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="social-icon">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="social-icon">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="social-icon">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="social-icon">
                <FiYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="footer-link">
                  Trainers
                </Link>
              </li>
              <li>
                <Link to="/classes" className="footer-link">
                  Classes
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="footer-link">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FiMapPin className="h-5 w-5 text-blue-500" />
                <span>1234 Fitness Street, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="h-5 w-5 text-blue-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="h-5 w-5 text-blue-500" />
                <span>info@fitconnect.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiClock className="h-5 w-5 text-blue-500" />
                <span>Mon - Fri: 6:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professional Login Section */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-white">Professional Login</h4>
            <p className="text-gray-400 mt-2">
              Access your professional dashboard
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/login?role=gym-owner"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiUser className="h-5 w-5 text-violet-400" />
              <span>Gym Owner Login</span>
            </Link>
            <Link
              to="/login?role=instructor"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiBook className="h-5 w-5 text-violet-400" />
              <span>Instructor Login</span>
            </Link>
            <Link
              to="/login?role=admin"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiShield className="h-5 w-5 text-violet-400" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} FitConnect. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
