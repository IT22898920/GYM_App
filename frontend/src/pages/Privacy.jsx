import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiLock,
  FiDatabase,
  FiEye,
  FiShield,
  FiGlobe,
  FiTrash2,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";

function Privacy() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("collection");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sections = [
    { id: "collection", title: "Data Collection" },
    { id: "usage", title: "Data Usage" },
    { id: "sharing", title: "Data Sharing" },
    { id: "security", title: "Data Security" },
    { id: "cookies", title: "Cookies Policy" },
    { id: "rights", title: "Your Rights" },
    { id: "contact", title: "Contact Us" },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900/50 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full animate-float"
              style={{
                width: Math.random() * 300 + 50 + "px",
                height: Math.random() * 300 + 50 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`container mx-auto px-4 relative transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
            <FiLock className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400">
            Learn how we collect, use, and protect your personal information
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8 bg-gray-800/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-violet-500/10 text-violet-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-12">
            {/* Data Collection */}
            <section
              id="collection"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Data Collection
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We collect information that you provide directly to us, as
                  well as data about your use of our platform.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiDatabase className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Information We Collect
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Personal identification information</li>
                        <li>Contact information</li>
                        <li>Payment details</li>
                        <li>Fitness goals and preferences</li>
                        <li>Usage data and activity logs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section
              id="usage"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Data Usage</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We use your information to provide and improve our services,
                  and to communicate with you.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiEye className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        How We Use Your Data
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide personalized fitness recommendations</li>
                        <li>Process payments and memberships</li>
                        <li>Send important notifications</li>
                        <li>Improve our services</li>
                        <li>Analyze usage patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section
              id="sharing"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Data Sharing
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We share your information only in specific circumstances and
                  with trusted partners.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiGlobe className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Information Sharing
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>With gyms you're registered with</li>
                        <li>With instructors for class management</li>
                        <li>With payment processors</li>
                        <li>When required by law</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section
              id="security"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Data Security
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We implement appropriate security measures to protect your
                  personal information.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiShield className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Security Measures
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Encryption of sensitive data</li>
                        <li>Regular security audits</li>
                        <li>Access controls</li>
                        <li>Secure data storage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies Policy */}
            <section
              id="cookies"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Cookies Policy
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We use cookies and similar technologies to enhance your
                  experience on our platform.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiDatabase className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Cookie Usage
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Essential cookies for functionality</li>
                        <li>Analytics cookies</li>
                        <li>Preference cookies</li>
                        <li>Marketing cookies (with consent)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section
              id="rights"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  You have certain rights regarding your personal information.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiTrash2 className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Your Data Rights
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Right to access your data</li>
                        <li>Right to correct your data</li>
                        <li>Right to delete your data</li>
                        <li>Right to data portability</li>
                        <li>Right to withdraw consent</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section
              id="contact"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  If you have any questions about our privacy policy or data
                  practices, please contact us.
                </p>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiMail className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Contact Information
                      </h3>
                      <ul className="list-none space-y-2">
                        <li>Email: privacy@fitconnect.com</li>
                        <li>Phone: (555) 123-4567</li>
                        <li>
                          Address: 1234 Privacy Street, San Francisco, CA 94105
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiAlertCircle className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Response Time
                      </h3>
                      <p>
                        We aim to respond to all privacy-related inquiries
                        within 48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
