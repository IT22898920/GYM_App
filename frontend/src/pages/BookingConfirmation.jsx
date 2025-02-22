import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

function BookingConfirmation() {
  const { classId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Sample class details - replace with actual data fetch
  const classDetails = {
    id: classId,
    name: "Morning Yoga Flow",
    instructor: "Sarah Johnson",
    date: "2024-03-15",
    time: "07:00 AM",
    duration: "60 min",
    location: "FitZone Elite - Downtown",
    price: 25,
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsConfirmed(true);
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
          to="/classes"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Classes
        </Link>

        <div className="max-w-2xl mx-auto">
          {!isConfirmed ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Complete Your Booking
              </h1>

              {/* Class Details */}
              <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Class</span>
                    <span className="text-white">{classDetails.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Date & Time</span>
                    <span className="text-white">
                      {new Date(classDetails.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {classDetails.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Duration</span>
                    <span className="text-white">{classDetails.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Instructor</span>
                    <span className="text-white">
                      {classDetails.instructor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Location</span>
                    <span className="text-white">{classDetails.location}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-4"></div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Price</span>
                    <span className="text-2xl font-bold text-white">
                      ${classDetails.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["credit-card", "paypal"].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          paymentMethod === method
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "bg-gray-900/50 border-gray-700 text-gray-400 hover:bg-gray-800/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <FiCreditCard
                          className={`w-5 h-5 ${
                            paymentMethod === method
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        />
                        {method === "credit-card" ? "Credit Card" : "PayPal"}
                      </label>
                    ))}
                  </div>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-gray-300 mb-2">CVC</label>
                        <input
                          type="text"
                          className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!paymentMethod || isProcessing}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10">
                    {isProcessing ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      `Pay $${classDetails.price}`
                    )}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            // Confirmation Success
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                <FiCheck className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Your spot in {classDetails.name} has been reserved
              </p>

              <div className="max-w-lg mx-auto bg-gray-900/50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Class</span>
                    <span className="text-white">{classDetails.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Date & Time</span>
                    <span className="text-white">
                      {new Date(classDetails.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {classDetails.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Duration</span>
                    <span className="text-white">{classDetails.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Instructor</span>
                    <span className="text-white">
                      {classDetails.instructor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Location</span>
                    <span className="text-white">{classDetails.location}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-4"></div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Booking Reference</span>
                    <span className="text-white font-mono">
                      BC{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/classes"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Book Another Class
                </Link>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Download Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
