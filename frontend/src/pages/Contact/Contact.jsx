import { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Our Location",
      content: "1234 Fitness Street, NY 10001",
      description: "Visit our state-of-the-art facility"
    },
    {
      icon: FiPhone,
      title: "Phone Number",
      content: "(555) 123-4567",
      description: "Mon-Fri from 8am to 8pm"
    },
    {
      icon: FiMail,
      title: "Email Address",
      content: "info@fitconnect.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: FiClock,
      title: "Working Hours",
      content: "Mon - Fri: 6:00 AM - 10:00 PM",
      description: "Sat - Sun: 8:00 AM - 8:00 PM"
    }
  ];

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
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className={`container mx-auto px-4 relative transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className={`group bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-violet-400 font-medium mb-1">{info.content}</p>
                <p className="text-gray-400 text-sm">{info.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 animate-pulse-slow"></div>
            
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Your Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 placeholder-gray-500"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                      Your Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 text-white rounded-lg px-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 placeholder-gray-500"
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label className="block text-gray-300 mb-2 transition-colors group-focus-within:text-violet-400">
                    Message
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-4 top-3.5 text-gray-500 transition-colors group-focus-within:text-violet-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full bg-gray-900/50 text-white rounded-lg pl-12 pr-4 py-3 border border-gray-700/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-300 placeholder-gray-500 resize-none"
                      placeholder="Your message..."
                    ></textarea>
                    {errors.message && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-sm mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 inline-flex items-center justify-center">
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        Send Message
                        <FiSend className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;