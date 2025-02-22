import { Link } from "react-router-dom";
import {
  FiPlay,
  FiCheckCircle,
  FiArrowRight,
  FiActivity,
  FiHeart,
  FiClock,
  FiCalendar,
  FiArrowDown,
  FiBook,
  FiDollarSign,
  FiUsers,
  FiCheck,
  FiTarget,
  FiTrendingUp,
  FiSearch,
  FiMapPin,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

function Home() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: classesRef, inView: classesInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: instructorRef, inView: instructorInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: findGymRef, inView: findGymInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const videoSources = [
    "https://player.vimeo.com/progressive_redirect/playback/735428933/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=e7fddd273b90b33fb2f9e6e9e23d59d1e4ec068f8c1a5b7a83e58a93c70a1754",
    "https://player.vimeo.com/progressive_redirect/playback/735429462/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=7d0e9b5ea5c2549b4d6c6d174e0d59a3e7d7d2d8e9d0c4f8e2c75f8d4a4c4c4c",
    "https://player.vimeo.com/progressive_redirect/playback/735429848/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=7d0e9b5ea5c2549b4d6c6d174e0d59a3e7d7d2d8e9d0c4f8e2c75f8d4a4c4c4c",
    "https://player.vimeo.com/progressive_redirect/playback/735430144/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=a9fbf170671599f0eaa4bd46b8dd148af0c64c6c0e947c92f4ad7f83b8f6f3f3",
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videoSources.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "500+", label: "Partner Gyms" },
    { number: "100+", label: "Weekly Classes" },
    { number: "50+", label: "Expert Trainers" },
    { number: "10+", label: "Years Experience" },
  ];

  const gymBenefits = [
    {
      icon: FiUsers,
      title: "Expand Your Reach",
      description:
        "Connect with thousands of potential members through our platform",
      color: "from-emerald-600 to-teal-600",
    },
    {
      icon: FiActivity,
      title: "Smart Management",
      description:
        "Access powerful tools to manage memberships, classes, and staff",
      color: "from-violet-600 to-purple-600",
    },
    {
      icon: FiDollarSign,
      title: "Boost Revenue",
      description:
        "Increase revenue with our integrated payment and booking system",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: FiHeart,
      title: "Build Community",
      description: "Create a thriving fitness community with engaged members",
      color: "from-pink-600 to-rose-600",
    },
  ];

  const features = [
    {
      icon: FiActivity,
      title: "Expert Trainers",
      description:
        "Work with certified fitness professionals who will guide you every step of the way",
    },
    {
      icon: FiHeart,
      title: "Modern Equipment",
      description:
        "Access to state-of-the-art facilities and the latest fitness machines",
    },
    {
      icon: FiClock,
      title: "Flexible Classes",
      description:
        "Choose from 100+ weekly classes that fit your schedule perfectly",
    },
    {
      icon: FiCalendar,
      title: "Nutrition Plans",
      description:
        "Get personalized diet and supplement advice from nutrition experts",
    },
  ];

  const classes = [
    {
      id: 1,
      title: "HIIT Training",
      image:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80",
      duration: "45 min",
      intensity: "High",
      trainer: "Mike Johnson",
      time: "9:00 AM",
    },
    {
      id: 2,
      title: "Yoga Flow",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
      duration: "60 min",
      intensity: "Medium",
      trainer: "Emma Rodriguez",
      time: "10:30 AM",
    },
    {
      id: 3,
      title: "Strength Training",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
      duration: "50 min",
      intensity: "High",
      trainer: "Sarah Chen",
      time: "2:00 PM",
    },
  ];

  const instructorBenefits = [
    {
      icon: FiDollarSign,
      title: "Competitive Pay",
      description: "Earn top industry rates with performance bonuses",
    },
    {
      icon: FiUsers,
      title: "Growing Community",
      description: "Work with dedicated members and fellow trainers",
    },
    {
      icon: FiBook,
      title: "Professional Growth",
      description: "Access to continuous education and certifications",
    },
    {
      icon: FiHeart,
      title: "Work-Life Balance",
      description: "Flexible scheduling and comprehensive benefits",
    },
  ];

  const trainerVideos = [
    {
      title: "Strength Training",
      trainer: "Mike Johnson",
      specialty: "Power Lifting",
      video:
        "https://videos.pexels.com/video-files/4753017/4753017-uhd_1440_2732_25fps.mp4",
    },
    {
      title: "HIIT Workouts",
      trainer: "Sarah Chen",
      specialty: "Cardio Expert",
      video:
        "https://videos.pexels.com/video-files/5319745/5319745-uhd_1440_2560_25fps.mp4",
    },
    {
      title: "Yoga Flow",
      trainer: "Emma Rodriguez",
      specialty: "Mind & Body",
      video:
        "https://videos.pexels.com/video-files/6603228/6603228-uhd_1440_2560_30fps.mp4",
    },
  ];

    const featuredGyms = [
      {
        id: 1,
        name: "FitZone Elite",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 245,
        location: "San Francisco, CA",
        amenities: [
          "Cardio Equipment",
          "Weight Training",
          "Personal Training",
          "Yoga Studio",
        ],
        price: "$$",
      },
      {
        id: 2,
        name: "PowerFlex Gym",
        image:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
        rating: 4.6,
        reviews: 189,
        location: "Los Angeles, CA",
        amenities: ["CrossFit", "Olympic Lifting", "Group Classes", "Spa"],
        price: "$$$",
      },
      {
        id: 3,
        name: "Wellness Hub",
        image:
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 312,
        location: "New York, NY",
        amenities: ["Pool", "Sauna", "Yoga Studio", "Pilates"],
        price: "$$",
      },
    ];


  return (
    <div className="flex flex-col bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/50 to-gray-900"></div>

        {/* Video Background with Transitions */}
        <div className="absolute inset-0 overflow-hidden">
          {videoSources.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeVideo === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                className="w-full h-full object-cover scale-105 transform transition-transform duration-8000 ease-out"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  transform: activeVideo === index ? "scale(1.1)" : "scale(1)",
                }}
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}

          {/* Video Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 to-gray-900/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animation: `float ${
                    Math.random() * 10 + 10
                  }s linear infinite`,
                  animationDelay: `-${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative container mx-auto px-4 h-screen flex items-center justify-between">
          {/* Left side content */}
          <div className="max-w-2xl">
            <h1
              className={`text-6xl md:text-7xl font-bold mb-6 transition-all duration-1000 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              Transform Your Body,
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                Transform Your Life
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl mb-12 text-gray-300 transition-all duration-1000 delay-300 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              Join FitConnect and embark on a journey to your best self. Expert
              trainers, state-of-the-art equipment, and a supportive community
              await you.
            </p>
            <div
              className={`flex flex-wrap gap-6 transition-all duration-1000 delay-500 transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 rounded-full font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="flex items-center gap-3 text-gray-300 hover:text-violet-400 transition-colors group">
                <span className="h-14 w-14 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors relative">
                  <FiPlay className="h-6 w-6" />
                  <span className="absolute inset-0 rounded-full animate-ping bg-white/10"></span>
                </span>
                Watch Success Stories
              </button>
            </div>
          </div>

          {/* Right side animated segment */}
          <div
            className={`hidden lg:block w-[600px] h-[600px] relative transition-all duration-1000 transform ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            {/* Animated circles */}
            <div className="absolute inset-0">
              <div className="absolute w-full h-full rounded-full border-4 border-violet-500/20 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-[80%] h-[80%] top-[10%] left-[10%] rounded-full border-4 border-indigo-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute w-[60%] h-[60%] top-[20%] left-[20%] rounded-full border-4 border-purple-500/20 animate-[spin_10s_linear_infinite]"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0">
              {/* Dumbell icon */}
              <div className="absolute top-[10%] left-[20%] bg-violet-600/90 p-4 rounded-2xl shadow-lg animate-float">
                <FiActivity className="h-8 w-8" />
              </div>

              {/* Heart rate */}
              <div
                className="absolute top-[30%] right-[10%] bg-indigo-600/90 p-4 rounded-2xl shadow-lg animate-float"
                style={{ animationDelay: "1s" }}
              >
                <FiHeart className="h-8 w-8" />
              </div>

              {/* Timer */}
              <div
                className="absolute bottom-[20%] left-[15%] bg-purple-600/90 p-4 rounded-2xl shadow-lg animate-float"
                style={{ animationDelay: "2s" }}
              >
                <FiClock className="h-8 w-8" />
              </div>

              {/* Achievement */}
              <div
                className="absolute bottom-[30%] right-[20%] bg-violet-600/90 p-4 rounded-2xl shadow-lg animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <FiCheckCircle className="h-8 w-8" />
              </div>
            </div>

            {/* Central glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl animate-pulse"></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Particle effects */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${1 + Math.random() * 3}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <FiArrowDown className="h-8 w-8 text-violet-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-20 bg-gray-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Happy Members" },
              { number: "100+", label: "Weekly Classes" },
              { number: "50+", label: "Expert Trainers" },
              { number: "10+", label: "Years Experience" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 transform ${
                  statsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2 transform group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register Your Gym Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Register Your Gym
            </h2>
            <p className="text-xl text-gray-400">
              Join the FitConnect network and take your gym business to the next
              level. Get access to powerful management tools and connect with
              more potential members.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {gymBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div
                    className={`h-16 w-16 bg-gradient-to-br ${benefit.color}/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Features List */}
          <div className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Member Management System",
                "Class Scheduling Tools",
                "Payment Processing",
                "Analytics Dashboard",
                "Marketing Tools",
                "Mobile App Integration",
                "Staff Management",
                "Equipment Tracking",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <FiCheck className="w-5 h-5 text-violet-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/register-gym"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                Register Your Gym Now
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              Join {stats[0].number}+ partner gyms already on our platform
            </p>
          </div>
        </div>
      </section>

      {/* Become an Instructor Section */}
      <section
        ref={instructorRef}
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Join Our Team of Expert Trainers
            </h2>
            <p className="text-xl text-gray-400">
              Are you passionate about fitness and helping others achieve their
              goals? Join FitConnect as an instructor and be part of our growing
              community.
            </p>
          </div>

          {/* Trainer Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {trainerVideos.map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                  instructorInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                  <video
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      <p className="text-violet-400 font-medium">
                        {item.trainer}
                      </p>
                      <p className="text-gray-300 text-sm">{item.specialty}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {instructorBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`group bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden ${
                  instructorInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="h-16 w-16 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-200 group-hover:text-white transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/apply-instructor"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                Apply Now
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Class Schedule Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Upcoming Classes
            </h2>
            <p className="text-xl text-gray-400">
              Join our expert-led fitness classes and start your journey to a
              healthier lifestyle
            </p>
          </div>

          {/* Featured Classes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="group bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {cls.title}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-violet-400" />
                      {cls.trainer}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm">
                    {cls.intensity}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <FiClock className="w-4 h-4 mr-2 text-violet-400" />
                    {cls.time} • {cls.duration}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiMapPin className="w-4 h-4 mr-2 text-violet-400" />
                    Main Studio
                  </div>
                </div>

                <Link
                  to={`/book-class/${cls.id}`}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10">Book Now</span>
                </Link>
              </div>
            ))}
          </div>

          {/* View Full Schedule Button */}
          <div className="text-center">
            <Link
              to="/classes"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                View Full Schedule
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Find Your Perfect Gym Section */}
      <section
        ref={findGymRef}
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Find Your Perfect Gym
            </h2>
            <p className="text-xl text-gray-400">
              Discover top-rated gyms and fitness centers near you. Filter by
              amenities, price range, and read authentic reviews from our
              community.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-xl p-2 rounded-full border border-gray-700/50">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location or gym name..."
                  className="w-full bg-transparent text-white pl-12 pr-4 py-3 focus:outline-none"
                />
              </div>
              <Link
                to="/find-gym"
                className="bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700  transition-colors"
              >
                Search Gyms
              </Link>
            </div>
          </div>

          {/* Featured Gyms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGyms.map((gym, index) => (
              <div
                key={gym.id}
                className={`group bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300 transform ${
                  findGymInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative aspect-video">
                  <img
                    src={gym.image}
                    alt={gym.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {gym.name}
                    </h3>
                    <div className="flex items-center">
                      <FiStar className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-white font-medium">
                        {gym.rating}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({gym.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span>{gym.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gym.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">
                      Starting from{" "}
                      <span className="text-white font-medium">
                        {gym.price}
                      </span>
                    </span>
                    <Link
                      to={`/find-gym/${gym.id}`}
                      className="text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/find-gym"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                View All Gyms
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Why Choose FitConnect?
            </h2>
            <p className="text-xl text-gray-400">
              Experience the perfect blend of professional guidance, modern
              facilities, and a motivating atmosphere designed for your success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-500 transform ${
                  featuresInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="h-16 w-16 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative">
                  <feature.icon className="h-8 w-8 text-violet-400" />
                  <div className="absolute inset-0 bg-violet-400/20 rounded-2xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-200 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section
        ref={classesRef}
        className="py-24 bg-gray-800 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Featured Classes
            </h2>
            <p className="text-xl text-gray-400">
              Discover our most popular fitness classes designed to help you
              achieve your goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform ${
                  classesInView
                    ? "opacity-100 translate-y-0 rotate-0"
                    : "opacity-0 translate-y-10 rotate-2"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {classItem.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    <span className="flex items-center gap-1">
                      <FiClock className="h-4 w-4 text-violet-400" />
                      {classItem.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiHeart className="h-4 w-4 text-violet-400" />
                      {classItem.intensity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="w-full h-full object-cover scale-105"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/735429462/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=7d0e9b5ea5c2549b4d6c6d174e0d59a3e7d7d2d8e9d0c4f8e2c75f8d4a4c4c4c"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 to-indigo-900/90"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <div
            className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
              ctaInView
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-12 text-gray-300">
              Join now and get 50% off your first month! Limited time offer for
              new members. Transform your life with FitConnect's premium
              facilities and expert guidance.
            </p>
            <div className="flex flex- wrap justify-center gap-6">
              <Link
                to="/signup"
                className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/pricing"
                className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  View Pricing
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Subscribe to our newsletter for fitness tips, success stories, and
              exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-4 rounded-full bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition-colors transform hover:scale-105 focus:scale-105"
              />
              <button
                type="submit"
                className="group bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative z-10 flex items-center">
                  Subscribe
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
