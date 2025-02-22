import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiShield,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiLock,
  FiUser,
  FiUsers,
} from "react-icons/fi";

function Terms() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sections = [
    { id: "general", title: "General Terms" },
    { id: "membership", title: "Membership Terms" },
    { id: "instructor", title: "Instructor Terms" },
    { id: "gym", title: "Gym Owner Terms" },
    { id: "payment", title: "Payment Terms" },
    { id: "cancellation", title: "Cancellation Policy" },
    { id: "liability", title: "Liability & Waiver" },
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
            <FiShield className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-400">
            Please read these terms and conditions carefully before using our
            services
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
            {/* General Terms */}
            <section
              id="general"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                General Terms
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  By accessing and using FitConnect's platform and services, you
                  agree to be bound by these terms and conditions. If you
                  disagree with any part of these terms, you may not access our
                  services.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <p>
                      You must be at least 18 years old to use our services.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <p>
                      You are responsible for maintaining the confidentiality of
                      your account information.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <p>
                      We reserve the right to modify or terminate services for
                      any reason, without notice.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Membership Terms */}
            <section
              id="membership"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Membership Terms
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Membership terms outline the rights, responsibilities, and
                  privileges of FitConnect members.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiUser className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Member Responsibilities
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Follow gym rules and regulations</li>
                        <li>Respect other members and staff</li>
                        <li>Maintain accurate profile information</li>
                        <li>Use facilities and equipment properly</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiClock className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Membership Duration
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Minimum commitment periods may apply</li>
                        <li>Automatic renewal unless cancelled</li>
                        <li>Notice period required for cancellation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Instructor Terms */}
            <section
              id="instructor"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Instructor Terms
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Terms and conditions specific to instructors providing
                  services through FitConnect.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiUsers className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Instructor Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Valid certifications must be maintained</li>
                        <li>Professional conduct standards</li>
                        <li>Class scheduling responsibilities</li>
                        <li>Student safety protocols</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gym Owner Terms */}
            <section
              id="gym"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Gym Owner Terms
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Terms and conditions for gym owners partnering with
                  FitConnect.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiLock className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Facility Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Safety and cleanliness standards</li>
                        <li>Insurance requirements</li>
                        <li>Equipment maintenance</li>
                        <li>Staff qualifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section
              id="payment"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Payment Terms
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Terms regarding payments, refunds, and billing procedures.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiDollarSign className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Payment Policies
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Automatic billing for subscriptions</li>
                        <li>Refund eligibility and process</li>
                        <li>Late payment penalties</li>
                        <li>Payment method requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section
              id="cancellation"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Cancellation Policy
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Terms regarding membership cancellation and class
                  cancellations.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiAlertCircle className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Cancellation Terms
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          30-day notice required for membership cancellation
                        </li>
                        <li>24-hour notice required for class cancellation</li>
                        <li>Cancellation fees may apply</li>
                        <li>Refund eligibility for cancelled services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Liability & Waiver */}
            <section
              id="liability"
              className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Liability & Waiver
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Terms regarding liability limitations and user agreements.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <FiShield className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        Liability Terms
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Assumption of risk acknowledgment</li>
                        <li>Injury liability limitations</li>
                        <li>Property damage responsibilities</li>
                        <li>Insurance requirements</li>
                      </ul>
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

export default Terms;
