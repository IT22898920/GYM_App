import { Link } from "react-router-dom";
import {
  FiGithub,
  FiHeart,
  FiCoffee,
  FiBook,
  FiLifeBuoy,
  FiShield,
  FiGlobe,
  FiMail,
  FiMessageSquare,
  FiArrowUp,
} from "react-icons/fi";

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "Documentation", icon: FiBook, href: "#" },
    { title: "Support", icon: FiLifeBuoy, href: "#" },
    { title: "Privacy", icon: FiShield, href: "#" },
  ];

  const contactLinks = [
    { title: "Website", icon: FiGlobe, href: "#" },
    { title: "Email", icon: FiMail, href: "mailto:support@fitconnect.com" },
    { title: "Chat", icon: FiMessageSquare, href: "#" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800/50 backdrop-blur-xl border-t border-gray-700/50">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                About FitConnect
              </span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering fitness businesses with modern management solutions.
              Built with love for the fitness community.
            </p>
            <div className="flex space-x-4">
              {contactLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-violet-400 transition-colors p-2 rounded-lg hover:bg-violet-500/10"
                  title={link.title}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center text-gray-400 hover:text-white transition-colors group"
                  >
                    <link.icon className="w-4 h-4 mr-2 group-hover:text-violet-400" />
                    <span className="text-sm">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h3 className="text-white font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">API</span>
                <span className="flex items-center text-green-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Dashboard</span>
                <span className="flex items-center text-green-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Database</span>
                <span className="flex items-center text-green-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Version Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Dashboard: v2.1.0</p>
              <p>Last Updated: Feb 20, 2024</p>
              <button
                onClick={scrollToTop}
                className="mt-4 flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors group"
              >
                <FiArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                <span>Back to top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear}</span>
              <Link
                to="/"
                className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                FitConnect
              </Link>
              <span>Admin Dashboard</span>
            </div>

            {/* Made with Love */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Crafted with</span>
              <FiHeart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>and</span>
              <FiCoffee className="w-4 h-4 text-amber-400" />
              <span>by</span>
              <a
                href="https://github.com/stackblitz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-violet-400 hover:text-violet-300 transition-colors group"
              >
                <FiGithub className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="relative">
                  StackBlitz
                  <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/security"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
